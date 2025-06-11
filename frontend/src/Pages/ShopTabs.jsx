// src/Pages/ShopTabs.jsx
import React, { useState, useEffect } from "react";
import Hero from "../Components/Hero/Hero";
import SearchBar from "../Components/SearchBar/SearchBar";
import Item from "../Components/Item/Item";
import api from "../api";
import "./ShopTabs.css";

export default function ShopTabs() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters]   = useState({});

  // Thirr /search sa herë që filters ndryshojnë
  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      setProducts([]);
      return;
    }
    api
      .get("/search", { params: filters })
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, [filters]);

  const applyFilters = ({ q, minPrice, maxPrice, category, sort }) => {
    const newF = {};
    if (q)         newF.q        = q;
    if (minPrice)  newF.minPrice = minPrice;
    if (maxPrice)  newF.maxPrice = maxPrice;
    if (category)  newF.category = category;
    if (sort)      newF.sort     = sort;
    setFilters(newF);
  };

  const clearFilters = () => {
    setFilters({});
    setProducts([]);
  };

  return (
    <div className="shop-tabs-page">
      {/* 1) HERO mbetet full-bleed */}
      <Hero />

      {/* 2) Këtu fillon zona e Search + Grid */}
      <div className="shop-tabs-container">
        <SearchBar onApply={applyFilters} onClear={clearFilters} />

        <div className="products-grid">
          {products.map((p) => (
            <Item
              key={p.id}
              id={p.id}
              name={p.name}
              image={p.image}
              price={p.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
