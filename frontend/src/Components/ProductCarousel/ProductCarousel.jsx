import React, { useRef } from "react";
import Item from "../Item/Item";
import "./ProductCarousel.css";

export default function ProductCarousel({ products = [] }) {
  const trackRef = useRef(null);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".item");
    const amount = (card?.offsetWidth || 260) + 20;
    track.scrollBy({ left: direction * amount * 2, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <div className="product-carousel">
      <button
        type="button"
        className="carousel-btn prev"
        onClick={() => scrollByCard(-1)}
        aria-label="Produkte të mëparshme"
      >
        ‹
      </button>
      <div className="product-carousel-track" ref={trackRef}>
        {products.map((product) => (
          <Item
            key={product._id || product.id}
            id={product.id || product._id}
            name={product.name}
            image={product.image}
            images={product.images}
            price={product.price}
          />
        ))}
      </div>
      <button
        type="button"
        className="carousel-btn next"
        onClick={() => scrollByCard(1)}
        aria-label="Produkte të radhës"
      >
        ›
      </button>
    </div>
  );
}
