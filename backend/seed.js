const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("./config");
const { User, Product } = require("./models");

const DEMO = {
  name: "Demo Shopper",
  email: "demo@hsm.shop",
  password: "Demo1234!",
};

const PRODUCTS = [
  {
    id: 101,
    name: "Garniturë Lino",
    description: "Sofë 3+2 me pëlhurë të butë, e përshtatshme për dhomë ndenjeje.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    category: "garnitura",
    price: 890,
    available: true,
  },
  {
    id: 102,
    name: "Garniturë Oslo",
    description: "Këndore moderne me këmbë druri dhe jastëkë të thellë.",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
    category: "garnitura",
    price: 1190,
    available: true,
  },
  {
    id: 103,
    name: "Divan Nova",
    description: "Divan kompakt për apartamente, tapiceri gri e errët.",
    image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=900&q=80",
    category: "garnitura",
    price: 540,
    available: true,
  },
  {
    id: 201,
    name: "Tavolinë buke Oak",
    description: "Tavolinë ngrënieje për 6 persona, sipërfaqe lis i natyrshëm.",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80",
    category: "tavolinabuke",
    price: 420,
    available: true,
  },
  {
    id: 202,
    name: "Set ngrënie Milano",
    description: "Tavolinë + 4 karrige, stil skandinav.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
    category: "tavolinabuke",
    price: 680,
    available: true,
  },
  {
    id: 203,
    name: "Tavolinë zgjeruese",
    description: "Tavolinë që hapet për darka familjare, deri në 8 persona.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80",
    category: "tavolinabuke",
    price: 510,
    available: true,
  },
  {
    id: 301,
    name: "Shtrat Cloud",
    description: "Shtrat queen me krevat të tapicuar dhe hapësirë magazinimi.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    category: "dhomagjumi",
    price: 760,
    available: true,
  },
  {
    id: 302,
    name: "Set dhome gjumi Aura",
    description: "Shtrat, dy komodina dhe dollap, dru i çelët.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80",
    category: "dhomagjumi",
    price: 1290,
    available: true,
  },
  {
    id: 303,
    name: "Komodinë + shtrat Nova",
    description: "Set minimal për dhomë gjumi, ngjyrë e zezë e butë.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80",
    category: "dhomagjumi",
    price: 640,
    available: true,
  },
  {
    id: 401,
    name: "Pasqyrë Arc",
    description: "Pasqyrë e madhe me kornizë të artë të butë.",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    category: "kende",
    price: 180,
    available: true,
  },
  {
    id: 501,
    name: "Karrikë Velvet",
    description: "Karrikë ngrënieje me tapiceri kadife.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80",
    category: "karrika",
    price: 95,
    available: true,
  },
  {
    id: 601,
    name: "Tavolinë mesi Marble",
    description: "Tavolinë mesi me sipërfaqe marmere dhe këmbë metalike.",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80",
    category: "tavolinamesi",
    price: 260,
    available: true,
  },
];

async function seedCatalog({ forceProducts = false } = {}) {
  for (const product of PRODUCTS) {
    const update = { $set: product };
    if (forceProducts) {
      await Product.updateOne({ id: product.id }, update, { upsert: true });
    } else {
      await Product.updateOne({ id: product.id }, { $setOnInsert: product }, { upsert: true });
    }
  }

  const existing = await User.findOne({ email: DEMO.email });
  if (!existing) {
    await User.create({
      name: DEMO.name,
      email: DEMO.email,
      password: await bcrypt.hash(DEMO.password, 10),
      role: "user",
    });
  }
}

async function run() {
  await mongoose.connect(config.mongoUri);
  await seedCatalog({ forceProducts: true });
  const count = await Product.countDocuments();
  console.log(`Seed complete. Products in catalog: ${count}`);
  console.log(`Demo login: ${DEMO.email} / ${DEMO.password}`);
  await mongoose.disconnect();
}

if (require.main === module) {
  run().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
}

module.exports = { seedCatalog, PRODUCTS, DEMO };
