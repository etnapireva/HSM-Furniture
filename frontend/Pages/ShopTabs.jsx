// src/Pages/ShopTabs.jsx
import React, { useState, useEffect, useRef } from "react";
import Hero from "../Components/Hero/Hero";
import AdvancedSearchBar from "../Components/AdvancedSearchBar/AdvancedSearchBar";
import Item from "../Components/Item/Item";
import { backend_url } from "../App";
import "./ShopTabs.css";
import locationIcon from "../Components/Assets/location_logo.png";
import heroImg from "../Components/Assets/hero_image.jpg";

export default function ShopTabs() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const searchResultsRef = useRef(null);
  const loadingRef = useRef(null);
  const errorRef = useRef(null);
  const noResultsRef = useRef(null);

  const searchProducts = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 ShopTabs searchProducts called with:", searchParams);
      console.log("🔍 searchParams type:", typeof searchParams);
      console.log("🔍 searchParams keys:", Object.keys(searchParams || {}));
      
      // Build query string
      const params = new URLSearchParams();
      if (searchParams && typeof searchParams === 'object') {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value !== "" && value !== false && value !== "relevance" && value !== null && value !== undefined) {
            params.append(key, value);
          }
        });
      }
      
      // Always make the API call, even with empty parameters
      if (params.toString() === "") {
        console.log("🔍 No valid search parameters, making empty search");
        params.append("q", "");
      }

      const response = await fetch(`${backend_url}/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📦 Search results:", data);
      
      setProducts(data.products || []);
      setSearchResults({
        products: data.products || [],
        pagination: data.pagination || { total: 0, page: 1, limit: 50, totalPages: 1 },
        filters: data.filters || {}
      });
      
      console.log("📦 Products set to state:", data.products?.length);
      console.log("📦 Search results set:", data.products?.length > 0);
      
    } catch (err) {
      console.error("❌ Search error:", err);
      setError("Gabim gjatë kërkimit. Ju lutemi provoni përsëri.");
      setProducts([]);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setProducts([]);
    setError(null);
    setSearchResults(null);
  };

  // Scroll to search results when they change
  useEffect(() => {
    if (searchResults || loading || error) {
      setTimeout(() => {
        // Try to scroll to the appropriate element based on current state
        let targetRef = null;
        if (loading) {
          targetRef = loadingRef.current;
        } else if (error) {
          targetRef = errorRef.current;
        } else if (searchResults && searchResults.pagination) {
          if (searchResults.pagination.total > 0) {
            targetRef = searchResultsRef.current;
          } else {
            targetRef = noResultsRef.current;
          }
        }
        
        if (targetRef) {
          targetRef.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 200); // Increased delay to ensure DOM is fully updated
    }
  }, [searchResults, loading, error]);

  return (
    <div className="shop-tabs-page">
      {/* 1) HERO mbetet full-bleed */}
      <Hero />

      {/* 2) Këtu fillon zona e Search + Grid */}
      <div className="shop-tabs-container">
        <AdvancedSearchBar onSearch={searchProducts} onClear={clearSearch} />

        {/* Search Results Info */}
        {searchResults && searchResults.pagination && (
          <div ref={searchResultsRef} className="search-results-info">
            <h3>
              {searchResults.pagination.total > 0 
                ? `U gjetën ${searchResults.pagination.total} produkte`
                : "Nuk u gjetën produkte"
              }
            </h3>
            {searchResults.pagination.totalPages > 1 && (
              <p>Faqja {searchResults.pagination.page} nga {searchResults.pagination.totalPages}</p>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div ref={loadingRef} className="loading-message">
            <div className="loading-spinner"></div>
            <h3>Duke kërkuar produkte...</h3>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div ref={errorRef} className="error-message">
            <h3>❌ {error}</h3>
            <button onClick={() => setError(null)}>Mbyll</button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="search-products-grid">
            {products.map((product) => (
              <Item
                key={product._id || product.id}
                id={product._id || product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                prodhimi={product.prodhimi}
                color={product.color}
                material={product.material}
                size={product.size}
                stock={product.stock || 10}
                minStock={product.minStock || 5}
                reserved={product.reserved || 0}
              />
            ))}
          </div>
        )}

        {/* No Results Message for Search */}
        {!loading && !error && products.length === 0 && searchResults && searchResults.pagination && (
          <div ref={noResultsRef} className="no-results">
            <h3>Nuk u gjetën produkte</h3>
            <p>Provo të ndryshosh filtret ose të kërkosh diçka tjetër.</p>
          </div>
        )}

        {/* No Results Message for Categories */}
        {!loading && !error && products.length === 0 && !searchResults && (
          <div className="no-results">
            <h3>Nuk ka produkte në këtë kategori</h3>
            <p>Kategoria është bosh ose produktet nuk janë të disponueshme.</p>
          </div>
        )}

     
      </div>

      {/* 3) About Us section */}
      <section className="about-us">
        <div className="about-hero">
          <h2>Rreth HSM Furniture</h2>
          <p>
            Mobilje cilësore dhe moderne për çdo shtëpi. Kombinojmë dizajnin bashkëkohor
            me mjeshtërinë lokale për të krijuar hapësira të ngrohta dhe funksionale.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-image">
            <img src={heroImg} alt="Showroom" />
          </div>
          <div className="about-content">
            <h3>Pse të zgjidhni ne</h3>
            <ul className="about-list">
              <li>Materiale premium dhe përfundime të qëndrueshme</li>
              <li>Dizajne të kujdesshme për stil klasik dhe modern</li>
              <li>Porosi të personalizuara sipas hapësirës suaj</li>
              <li>Shërbim i përkushtuar dhe këshillim profesional</li>
            </ul>

            <div className="about-stats">
              <div className="stat">
                <span className="stat-num">10+</span>
                <span className="stat-label">Vite përvojë</span>
              </div>
              <div className="stat">
                <span className="stat-num">5000+</span>
                <span className="stat-label">Klientë të kënaqur</span>
              </div>
              <div className="stat">
                <span className="stat-num">200+</span>
                <span className="stat-label">Produkte aktive</span>
              </div>
            </div>

            <p className="about-note">
              Na vizitoni në Kamenicë ose Prishtinë për të parë koleksionet tona dhe
              për të marrë këshillim nga ekipi ynë.
            </p>
          </div>
        </div>
      </section>

      {/* 4) Maps section */}
      <section className="about-map">
        <div className="about-map-header">
          <img src={locationIcon} alt="Location" />
          <h3>Ku ndodhemi</h3>
        </div>
        <p className="about-map-sub">Na vizitoni në dy lokacionet tona kryesore</p>
        <div className="about-map-grid">
          <div className="map-card">
            <h4>Kamenicë</h4>
            <div className="map-embed">
              <iframe
                title="Haliti SM Kamenicë"
                src="https://www.google.com/maps?q=42.5801333,21.579156&z=15&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="map-card">
            <h4>Prishtinë</h4>
            <div className="map-embed">
              <iframe
                title="HSM Furniture Prishtine"
                src="https://www.google.com/maps?q=HSM%20Furniture%20Prishtine&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* 5) Working hours section */}
      <section className="about-hours">
        <h3>Orari i punës</h3>
        <div className="hours-grid">
          <div className="hour-row"><span>E hënë</span><span>09:00 – 19:00</span></div>
          <div className="hour-row"><span>E martë</span><span>09:00 – 19:00</span></div>
          <div className="hour-row"><span>E mërkurë</span><span>09:00 – 19:00</span></div>
          <div className="hour-row"><span>E enjte</span><span>09:00 – 19:00</span></div>
          <div className="hour-row"><span>E premte</span><span>09:00 – 19:00</span></div>
          <div className="hour-row"><span>E shtunë</span><span>09:00 – 19:00</span></div>
          <div className="hour-row closed"><span>E diel</span><span>E mbyllur</span></div>
        </div>
        <p className="hours-note">Për porosi të personalizuara, na kontaktoni paraprakisht për t'ju shërbyer më shpejt.</p>
      </section>
    </div>
  );
}
