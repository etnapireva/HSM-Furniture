// src/Pages/Shop.jsx  (or ShopTabs.jsx)
import React, { useState, useEffect, useRef } from "react";
import Hero from "../Components/Hero/Hero";
import SearchBar from "../Components/SearchBar/SearchBar";
import Item from "../Components/Item/Item";
import api from "../api";
import "./Shop.css";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters]   = useState({});
  const resultsRef = useRef(null);                  // ← ref

  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      setProducts([]);
      return;
    }
    api
      .get("/search", { params: filters })
      .then((res) => {
        setProducts(res.data);
        // scroll into view AFTER state updates
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      })
      .catch(console.error);
  }, [filters]);

  const applyFilters = (filterObj) => {
    setFilters(filterObj);
  };

  const clearFilters = () => {
    setFilters({});
    setProducts([]);
  };

  return (
    <div className="shop-page">
      <Hero />

      {/* we prevent a real page reload by handling form in SearchBar */}
      <SearchBar onApply={applyFilters} onClear={clearFilters} />

      {/* Results wrapper */}
      <div ref={resultsRef} className="products-grid">
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
