// src/Pages/ShopSearch.jsx
import React, { useState, useEffect } from "react";
import Hero from "../Components/Hero/Hero";
import SearchBar from "../Components/SearchBar/SearchBar";
import Item from "../Components/Item/Item";
import api from "../api";
import "./ShopTabs.css";

export default function ShopSearch() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters]   = useState({});

  // Sa herë që filters ndryshojnë, thërrasim /search
  useEffect(() => {
    // Nëse nuk ka asnjë filter, mos bëjmë thirrje
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
    const newFilters = {};
    if (q)         newFilters.q        = q;
    if (minPrice)  newFilters.minPrice = minPrice;
    if (maxPrice)  newFilters.maxPrice = maxPrice;
    if (category)  newFilters.category = category;
    if (sort)      newFilters.sort     = sort;
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setProducts([]);
  };

  return (
    <div className="shop-search">
      <Hero />

      <SearchBar
        onApply={applyFilters}
        onClear={clearFilters}
      />

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
  );
}
