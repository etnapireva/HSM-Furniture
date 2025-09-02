import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onApply, onClear }) {
  const [q, setQ]           = useState("");
  const [minPrice, setMin]  = useState("");
  const [maxPrice, setMax]  = useState("");

  const apply = () => onApply({ q, minPrice, maxPrice });
  const clear = () => {
    setQ(""); setMin(""); setMax("");
    onClear();
  };

  return (
    <div className="search-bar">
      <input
        type="text" placeholder="Search…"
        value={q} onChange={e=>setQ(e.target.value)}
      />
      <input
        type="number" placeholder="Min price"
        value={minPrice} onChange={e=>setMin(e.target.value)}
      />
      <input
        type="number" placeholder="Max price"
        value={maxPrice} onChange={e=>setMax(e.target.value)}
      />
      <button onClick={apply}>Go</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
