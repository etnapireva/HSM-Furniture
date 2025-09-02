// src/Pages/ShopCategory.jsx
import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import Item from "../Components/Item/Item";
import { backend_url } from "../App";

export default function ShopCategory({ banner, category }) {
  const [products, setProducts]     = useState([]);
  const [sortOrder, setSortOrder]   = useState(""); // "", "price_asc", "price_desc"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Build the query string
        const params = new URLSearchParams();
        params.append("category", category);
        if (sortOrder) params.append("sort", sortOrder);

        const res = await fetch(`${backend_url}/search?${params.toString()}`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [category, sortOrder]);

  return (
    <div className="shopcategory">
      <img src={banner} className="shopcategory-banner" alt={category} />

      <div className="shopcategory-sort-card">
        <span className="sort-label">Sort by price</span>
        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_asc">Low → High</option>
          <option value="price_desc">High → Low</option>
        </select>
      </div>

      <div className="shopcategory-products">
        {products.length > 0 ? (
          products.map((p) => (
            <Item
              key={p._id || p.id}
              id={p._id || p.id}
              name={p.name}
              image={p.image}
              price={p.price}
            />
          ))
        ) : (
          <p className="no-results">Nuk ka produkte në këtë kategori.</p>
        )}
      </div>
    </div>
  );
}
