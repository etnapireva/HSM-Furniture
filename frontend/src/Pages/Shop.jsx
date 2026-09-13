import React, { useState, useEffect, useRef } from "react";
import Hero from "../Components/Hero/Hero";
import AdvancedSearchBar from "../Components/AdvancedSearchBar/AdvancedSearchBar";
import ProductCarousel from "../Components/ProductCarousel/ProductCarousel";
import { backend_url } from "../config";
import "./Shop.css";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const resultsRef = useRef(null);

  const searchProducts = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      console.log("🔍 Advanced search with params:", searchParams);
      
      // Build query string
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== "" && value !== false && value !== "relevance") {
          params.append(key, value);
        }
      });
      
      const response = await fetch(`${backend_url}/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📦 Search results:", data);
      
      setProducts(data.products || []);
      
      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
    } catch (err) {
      console.error("❌ Search error:", err);
      setError("Gabim gjatë kërkimit. Ju lutemi provoni përsëri.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setProducts([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="shop-page">
      <Hero />
      
      <AdvancedSearchBar onSearch={searchProducts} onClear={clearSearch} />

      {/* Results section */}
      <div ref={resultsRef} className="search-results">
        {loading && (
          <div className="loading-message">
            <h3>Duke kërkuar produkte...</h3>
            <div className="loading-spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <h3>❌ {error}</h3>
            <button onClick={() => setError(null)}>Mbyll</button>
          </div>
        )}

        {!loading && !error && products.length === 0 && hasSearched && (
          <div className="no-results">
            <h3>Nuk u gjetën produkte</h3>
            <p>Provo të kërkosh diçka tjetër.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductCarousel products={products} />
        )}
      </div>
    </div>
  );
}