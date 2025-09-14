// src/Pages/ShopCategory.jsx
import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import Item from "../Components/Item/Item";
import RecentlyViewed from "../Components/RecentlyViewed/RecentlyViewed";
import { backend_url } from "../App";
import locationIcon from "../Components/Assets/location_logo.png";
import heroImg from "../Components/Assets/hero_image.jpg";

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

        console.log("Fetching products for category:", category);
        const res = await fetch(`${backend_url}/search?${params.toString()}`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        console.log("Products received:", data);
        console.log("First product image path:", data.products?.[0]?.image);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [category, sortOrder]);

  // Category-specific content
  const getCategoryInfo = (category) => {
    const categoryMap = {
      'garnitura': {
        title: 'Garnitura Premium',
        subtitle: 'Rehati dhe Eleganca në Çdo Hapësirë',
        description: 'Zbuloni koleksionin tonë të kuruar të garniturave që kombinon rehatinë maksimale me dizajnin modern. Çdo garniturë është krijuar për të transformuar hapësirën tuaj të jetesës.',
        features: ['Materiale Premium', 'Dizajn Modern', 'Rehati Maksimale', 'Përfundime të Qëndrueshme']
      },
      'tavolinabuke': {
        title: 'Tavolina Buke Elegante',
        subtitle: 'Qendra e Familjes',
        description: 'Tavolinat tona të bukës janë më shumë se vetëm mobilje - ato janë qendra ku familja grumbullohet për momente të veçanta. Dizajne të sofistikuara për çdo stil shtëpie.',
        features: ['Dizajn Elegant', 'Materiale të Qëndrueshme', 'Madhësi të Ndryshme', 'Përfundime Premium']
      },
      'dhomagjumi': {
        title: 'Dhoma Gjumi të Rehatshme',
        subtitle: 'Oaza e Prehjes',
        description: 'Krijoni një oazë prehjeje me koleksionin tonë të mobiljeve për dhomën e gjumit. Çdo pjesë është dizajnuar për të ofruar rehati maksimale dhe stil të përkryer.',
        features: ['Rehati Maksimale', 'Dizajn i Qetë', 'Materiale Natyrale', 'Funksionalitet i Plotë']
      },
      'kende': {
        title: 'Kende dhe Pasqyra',
        subtitle: 'Reflektimi i Stilit Tuaj',
        description: 'Kendet dhe pasqyrat tona janë më shumë se aksesorë - ato janë pjesë integrale e dizajnit të shtëpisë suaj. Dizajne moderne që shtojnë karakter dhe funksionalitet.',
        features: ['Dizajn Modern', 'Reflektim i Përkryer', 'Materiale Premium', 'Madhësi të Ndryshme']
      },
      'karrika': {
        title: 'Karrika Premium',
        subtitle: 'Rehati në Çdo Detaj',
        description: 'Koleksioni ynë i karrikave kombinon rehatinë e përkryer me dizajnin elegant. Çdo karrikë është krijuar për të ofruar mbështetje të shkëlqyer dhe estetikë të sofistikuar.',
        features: ['Rehati e Përkryer', 'Dizajn Elegant', 'Materiale Premium', 'Mbështetje e Shkëlqyer']
      },
      'tavolinamesi': {
        title: 'Tavolina Mesi',
        subtitle: 'Qendra e Divanit',
        description: 'Tavolinat tona të mesit janë përsosur për të kompletuar hapësirën tuaj të jetesës. Dizajne praktike dhe elegante që ofrojnë funksionalitet dhe stil.',
        features: ['Dizajn Praktik', 'Funksionalitet i Plotë', 'Materiale të Qëndrueshme', 'Stil Elegant']
      }
    };
    return categoryMap[category] || {
      title: 'Koleksioni ynë',
      subtitle: 'Mobilje Premium',
      description: 'Zbuloni koleksionin tonë të kuruar të mobiljeve me cilësi të lartë.',
      features: ['Cilësi Premium', 'Dizajn Modern', 'Materiale të Qëndrueshme', 'Shërbim i Përkushtuar']
    };
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <div className="shopcategory">
      {/* Collection Hero Section */}
      <div className="collection-hero">
        <div className="collection-hero-content">
          <div className="collection-hero-text">
            <h1 className="collection-title">{categoryInfo.title}</h1>
            <h2 className="collection-subtitle">{categoryInfo.subtitle}</h2>
            <p className="collection-description">{categoryInfo.description}</p>
            <div className="collection-features">
              {categoryInfo.features.map((feature, index) => (
                <span key={index} className="feature-badge">{feature}</span>
              ))}
            </div>
          </div>
          <div className="collection-hero-image">
            <img src={banner} alt={category} />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="products-header">
          <h3>Produktet tona</h3>
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
                prodhimi={p.prodhimi}
                color={p.color}
                material={p.material}
                size={p.size}
                stock={p.stock}
                minStock={p.minStock}
                reserved={p.reserved}
              />
            ))
          ) : (
            <p className="no-results">Nuk ka produkte në këtë kategori.</p>
          )}
        </div>
      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewed />

      {/* About Us section */}
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

      {/* Maps section */}
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
      
      {/* Working hours section */}
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
