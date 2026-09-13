import React, { useContext, useEffect, useState } from "react";
import "./ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import { currency } from "../../config";
import { cartKey } from "../../config";
import ProductImage from "../ProductImage";
import { useWishlist } from "../../Context/WishlistContext";
import { rememberViewedProduct } from "../RecentlyViewed/RecentlyViewed";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const { addToWishlist, isInWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");
  const id = cartKey(product);

  useEffect(() => {
    rememberViewedProduct(product);
  }, [product, id]);

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Ju lutemi kycuni për të shtuar në shportë!");
      navigate("/login");
      return;
    }
    addToCart(id, qty);
    toast.success("Produkti u shtua në shportë.");
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <ProductImage
          className="productdisplay-main-img"
          image={product.image}
          images={product.images}
          alt={product.name}
        />
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-prices">
          <span className="productdisplay-right-price-new">
            <p>Çmimi: {product.price ? `${product.price} ${currency}` : "N/A"}</p>
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
          onClick={handleAddToCart} 
        >
          ADD TO CART
        </button>
        <button
          className="add-to-cart-btn"
          style={{ marginTop: 12, background: isInWishlist(id) ? "#8a7a68" : "#3b3428" }}
          onClick={() => addToWishlist(product)}
        >
          {isInWishlist(id) ? "Në Wishlist" : "Shto në Wishlist"}
        </button>
      </div>
    </div>
  );
};

export default ProductDisplay;