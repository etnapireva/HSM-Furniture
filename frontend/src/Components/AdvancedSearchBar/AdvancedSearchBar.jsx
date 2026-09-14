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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      <label className="advanced-search-field advanced-search-query">
        <span>Kërko</span>
        <input
          type="text"
          autoComplete="off"
          placeholder="Kërko mobilje..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          enterKeyHint="search"
        />
      </label>

      <button
        type="button"
        className={`advanced-search-toggle${filtersOpen ? " open" : ""}`}
        aria-expanded={filtersOpen}
        onClick={() => setFiltersOpen((open) => !open)}
      >
        {filtersOpen ? "Fshih filtrat" : "Filtra"}
      </button>

      <div className={`advanced-search-filters${filtersOpen ? " open" : ""}`}>
        <label className="advanced-search-field">
          <span>Kategoria</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </label>

        <div className="advanced-search-prices">
          <label className="advanced-search-field">
            <span>Çmimi min</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </label>
          <label className="advanced-search-field">
            <span>Çmimi max</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="9999"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </label>
        </div>

        <label className="advanced-search-field">
          <span>Rendit</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevance">Relevanca</option>
            <option value="newest">Më të rejat</option>
            <option value="price_asc">Çmimi ↑</option>
            <option value="price_desc">Çmimi ↓</option>
          </select>
        </label>
      </div>

      <div className="advanced-search-actions">
        <button type="submit">Kërko</button>
        <button type="button" onClick={handleClear}>Pastro</button>
      </div>
    </form>
  );
}
