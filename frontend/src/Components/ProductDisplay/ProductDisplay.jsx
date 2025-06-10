import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [qty, setQty] = useState(1);

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <img
          className="productdisplay-main-img"
          src={`${backend_url}${product.image}`}
          alt={product.name}
        />
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-prices">
          <span className="productdisplay-right-price-new">
            <p>Çmimi: {product.price ? `${currency}${product.price}` : "N/A"}€</p>
          </span>
        </div>
        <p className="productdisplay-right-description">
          {product.description}
        </p>
        <div className="quantity-control">
          <button onClick={() => setQty((q) => Math.max(q - 1, 1))}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={() => addToCart(product.id)}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductDisplay;