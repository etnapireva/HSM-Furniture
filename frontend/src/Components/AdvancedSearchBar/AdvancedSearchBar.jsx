import React, { useEffect, useState } from "react";
import "./AdvancedSearchBar.css";

const CATEGORIES = [
  { value: "", label: "Të gjitha" },
  { value: "garnitura", label: "Garnitura" },
  { value: "tavolinabuke", label: "Tavolina buke" },
  { value: "dhomagjumi", label: "Dhoma gjumi" },
  { value: "kende", label: "Kende" },
  { value: "karrika", label: "Karrika" },
  { value: "tavolinamesi", label: "Tavolina mesi" },
];

export default function AdvancedSearchBar({ onSearch, onClear }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    onSearch?.({});
    // Show the catalog as soon as the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event) => {
    event?.preventDefault();
    onSearch?.({ q, category, minPrice, maxPrice, sort });
  };

  const handleClear = () => {
    setQ("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("relevance");
    onClear?.();
    onSearch?.({});
  };

  return (
    <form className="advanced-search" onSubmit={handleSearch}>
      <div className="advanced-search-row">
        <input
          type="text"
          placeholder="Kërko mobilje..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Çmimi min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Çmimi max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="relevance">Relevanca</option>
          <option value="newest">Më të rejat</option>
          <option value="price_asc">Çmimi ↑</option>
          <option value="price_desc">Çmimi ↓</option>
        </select>
      </div>
      <div className="advanced-search-actions">
        <button type="submit">Kërko</button>
        <button type="button" onClick={handleClear}>Pastro</button>
      </div>
    </form>
  );
}
