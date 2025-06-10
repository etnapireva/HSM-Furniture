import React from "react";
import { useNavigate } from "react-router-dom";  // <-- e shtojmë këtu
import "./Hero.css";
import hero_image from "../Assets/hero_image.jpg";
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow.png";

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/garniture");  
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
        <div className="hero-latest-btn" onClick={handleClick} style={{cursor: "pointer"}}>
          <div>Garnitura</div>
          <img src={arrow_icon} alt="arrow" />
        </div>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="hero" />
      </div>
    </div>
  );
};

export default Hero;
