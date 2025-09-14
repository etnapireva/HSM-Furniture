import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Hero.css";
import hero_image from "../Assets/hero_image.jpg";
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow.png";
import hero_image2 from "../Assets/hero_image2.webp";
import hero_image3 from "../Assets/hero_image3.webp";
import hero_image4 from "../Assets/hero_image4.webp";
import hero_image5 from "../Assets/hero_image5.webp";

const Hero = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [showCollections, setShowCollections] = useState(false);
  const images = [hero_image, hero_image2, hero_image3, hero_image4, hero_image5];

  const collections = [
    { name: "Garnitura", path: "/category/garnitura", icon: "🛋️" },
    { name: "Tavolina", path: "/category/tavolinabuke", icon: "🪑" },
    { name: "Dhoma Gjumi", path: "/category/dhomagjumi", icon: "🛏️" },
    { name: "Kende", path: "/category/kende", icon: "🪞" },
    { name: "Karrika", path: "/category/karrika", icon: "🪑" },
    { name: "Tavolina Mesi", path: "/category/tavolinamesi", icon: "🍽️" }
  ];

  const handleClick = () => {
    navigate("/category/garnitura");
  };

  const handleCollectionClick = (path) => {
    navigate(path);
    setShowCollections(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="hero">
      <div className="hero-slideshow">
        <div className="slide-container">
          <img src={images[currentImage]} alt="hero" className="slide-image" />
          <div className="slide-overlay">
            <div className="slide-content">
              <div className="slide-badge">
                <span>Arritje të Reja</span>
              </div>
              <h1 className="slide-title">
HSM Furniture              </h1>
              <p className="slide-description">
                Zbuloni koleksionin tonë të kuruar të mobiljeve me cilësi të lartë që kombinon stilin, rehatinë dhe funksionalitetin.
              </p>
              <div className="slide-actions">
                <button className="slide-btn-primary" onClick={() => navigate("/category/garnitura")}>
                  Bli Tani
                  <img src={arrow_icon} alt="arrow" />
                </button>
                <div className="collections-dropdown">
                  <button 
                    className="slide-btn-secondary" 
                    onMouseEnter={() => setShowCollections(true)}
                    onMouseLeave={() => setShowCollections(false)}
                  >
                    Shiko Koleksionet
                  </button>
                  {showCollections && (
                    <div 
                      className="collections-menu"
                      onMouseEnter={() => setShowCollections(true)}
                      onMouseLeave={() => setShowCollections(false)}
                    >
                      {collections.map((collection, index) => (
                        <button
                          key={index}
                          className="collection-item"
                          onClick={() => handleCollectionClick(collection.path)}
                        >
                          {collection.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="slideshow-controls">
          <div className="slide-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`slide-dot ${index === currentImage ? 'active' : ''}`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
          <div className="slide-nav">
            <button 
              className="nav-btn prev" 
              onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
            >
              ‹
            </button>
            <button 
              className="nav-btn next" 
              onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;