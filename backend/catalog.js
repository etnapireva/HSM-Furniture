const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { Product } = require("./models");

const IMAGES_DIR = path.join(__dirname, "upload", "images");

const CATEGORY_COLLECTIONS = [
  "garnitura",
  "tavolinabuke",
  "dhomagjumi",
  "kende",
  "karrika",
  "tavolinamesi",
];

const CATEGORY_ALIASES = {
  garniture: "garnitura",
  tavolinebuke: "tavolinabuke",
  dhomegjumi: "dhomagjumi",
};

function collection(name) {
  return mongoose.connection.db.collection(name);
}

function firstImage(image) {
  const list = Array.isArray(image) ? image : image ? [image] : [];
  const existing = list.find((item) => {
    const file = String(item || "").replace(/^\/images\//, "");
    return file && fs.existsSync(path.join(IMAGES_DIR, file));
  });
  return existing || list[0] || "";
}

function normalize(doc, category) {
  const obj = { ...doc };
  const id = obj.id || obj._id;
  return {
    ...obj,
    _id: obj._id,
    id,
    name: obj.name || "",
    description: obj.description || "",
    image: firstImage(obj.image),
    images: Array.isArray(obj.image) ? obj.image : obj.image ? [obj.image] : [],
    category: obj.category || obj.collection || category,
    price: obj.price,
    available: obj.available !== false,
  };
}

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value)
    && String(new mongoose.Types.ObjectId(value)) === String(value);
}

async function catalogCount() {
  if (!mongoose.connection.db) return 0;
  const counts = await Promise.all(
    CATEGORY_COLLECTIONS.map((name) => collection(name).countDocuments())
  );
  return counts.reduce((sum, n) => sum + n, 0);
}

async function listFromCategoryCollections({ category } = {}) {
  const wanted = category
    ? CATEGORY_COLLECTIONS.filter((name) => name === CATEGORY_ALIASES[category] || name === category)
    : CATEGORY_COLLECTIONS;

  const groups = await Promise.all(
    wanted.map(async (name) => {
      const docs = await collection(name).find({}).toArray();
      return docs.map((doc) => normalize(doc, name));
    })
  );
  return groups.flat();
}

function applyFilters(products, { q, minPrice, maxPrice } = {}) {
  return products.filter((product) => {
    if (q) {
      const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      if (!haystack.includes(String(q).toLowerCase())) return false;
    }
    if (minPrice && Number(product.price) < Number(minPrice)) return false;
    if (maxPrice && Number(product.price) > Number(maxPrice)) return false;
    return true;
  });
}

function sortProducts(products, sort, salesData = {}) {
  const next = [...products];
  
  switch (sort) {
    case "price_asc":
      next.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case "price_desc":
      next.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case "newest":
      next.sort((a, b) => new Date(b.date || b.lastUpdated || 0) - new Date(a.date || a.lastUpdated || 0));
      break;
    case "name_asc":
      next.sort((a, b) => (a.name || "").localeCompare(b.name || "", "sq"));
      break;
    case "name_desc":
      next.sort((a, b) => (b.name || "").localeCompare(a.name || "", "sq"));
      break;
    case "best_selling":
      // Sort by total quantity sold (from salesData)
      next.sort((a, b) => {
        const idA = String(a._id || a.id);
        const idB = String(b._id || b.id);
        return (salesData[idB] || 0) - (salesData[idA] || 0);
      });
      break;
    default:
      // "relevance" or empty - keep original order
      break;
  }
  
  return next;
}

async function listProducts(query = {}) {
  const category = query.category ? CATEGORY_ALIASES[query.category] || query.category : "";
  const fromCatalog = await catalogCount();
  let products = fromCatalog > 0
    ? await listFromCategoryCollections({ category })
    : (await Product.find(category ? { category } : {}).lean()).map((doc) => normalize(doc, doc.category));

  // Get sales data if sorting by best_selling
  let salesData = {};
  if (query.sort === "best_selling") {
    salesData = await getSalesData();
  }

  products = sortProducts(applyFilters(products, query), query.sort, salesData);
  return products;
}

// Get aggregated sales data from orders
async function getSalesData() {
  try {
    const { Order } = require("./models");
    const orders = await Order.find({ status: { $ne: "cancelled" } }).lean();
    const salesData = {};
    
    for (const order of orders) {
      const productId = String(order.product_id);
      const quantity = order.quantity || 1;
      salesData[productId] = (salesData[productId] || 0) + quantity;
    }
    
    return salesData;
  } catch (err) {
    console.error("Error fetching sales data:", err);
    return {};
  }
}

async function findProduct(productId) {
  if (!productId) return null;

  if (isObjectId(productId)) {
    const objectId = new mongoose.Types.ObjectId(productId);
    for (const name of CATEGORY_COLLECTIONS) {
      const doc = await collection(name).findOne({ _id: objectId });
      if (doc) return normalize(doc, name);
    }
    const demo = await Product.findById(productId).lean();
    if (demo) return normalize(demo, demo.category);
  }

  const numericId = Number(productId);
  if (!Number.isNaN(numericId)) {
    const demo = await Product.findOne({ id: numericId }).lean();
    if (demo) return normalize(demo, demo.category);
  }

  return null;
}

module.exports = {
  CATEGORY_COLLECTIONS,
  catalogCount,
  listProducts,
  findProduct,
};
