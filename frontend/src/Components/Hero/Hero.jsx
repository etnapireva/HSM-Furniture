import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const images = [hero_image, hero_image2, hero_image3, hero_image4, hero_image5]; // Array i imazheve

  const handleClick = () => {
    navigate("/garniture");
  };

  // Automatizimi i slider-it
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Ndrysho 5000 (5 sekonda) për shpejtësi tjetër
    return () => clearInterval(interval); // Pastrimi kur komponenti hiqet
  }, []);

  // Funksioni për të naviguar te faqja e dyqanit
  const goToStoreDetails = () => {
    // Zëvendëso me URL-në e duhur
    window.location.href = "https://www.istanbulfurniture.com/pages/our-story-2";
    // Ose përdor navigate("/store-details") nëse dëshiron një rrugë brenda aplikacionit
  };

  return (
    <div className="hero">
      <div className="hero-left">
        <h2>Arritje te reja!</h2>
        <div>
          <div className="hero-hand-icon">
            <p>Shfletoni</p>
          </div>
        </div>
        <div className="hero-latest-btn" onClick={handleClick} style={{ cursor: "pointer" }}>
          <div>Garnitura</div>
          <img src={arrow_icon} alt="arrow" />
        </div>
      </div>
      <div className="hero-right">
        <div className="slider">
          <img src={images[currentImage]} alt="hero" className="slider-image" />
        </div>
      </div>
    </div>
  );
};

export default Hero;