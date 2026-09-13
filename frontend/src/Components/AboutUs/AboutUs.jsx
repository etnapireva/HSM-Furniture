import React from "react";
import "./AboutUs.css";
import heroImg from "../Assets/hero_image.jpg";
import locationIcon from "../Assets/location_logo.png";

const AboutUs = () => {
  return (
    <>
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
            <h3>Pse të na zgjidhni ne</h3>
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
    </>
  );
};

export default AboutUs;