// src/Components/CartItems/CartItems.jsx
import React, { useContext } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";

export default function CartItems() {
  const {
    products,
    cartItems,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const handleCheckout = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("Ju lutemi kyquni për të vazhduar me porosinë!");
      return;
    }

    // Gather all items with qty > 0
    const orders = products
      .filter((p) => cartItems[String(p.id)] > 0)
      .map((p) => ({
        product_id:  p.id,
        quantity:    cartItems[String(p.id)],
        total_price: p.price * cartItems[String(p.id)],
      }));

    if (orders.length === 0) {
      alert("Nuk ka artikuj në shportë!");
      return;
    }

    try {
      // Send one POST for each order line
      for (let order of orders) {
        const resp = await fetch(`${backend_url}/api/checkout`, {
          method:  "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token":    token,
          },
          body: JSON.stringify(order),
        });
        if (!resp.ok) {
          const errBody = await resp.json().catch(() => ({}));
          throw new Error(errBody.error || resp.statusText);
        }
      }
      alert("Porosia u ruajt me sukses!");
      clearCart();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Gabim gjatë porosisë: " + err.message);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {products.map((p) => {
        const pid = String(p.id);
        const qty = cartItems[pid] || 0;
        if (qty > 0) {
          return (
            <div key={pid}>
              <div className="cartitems-format-main cartitems-format">
                <img
                  className="cartitems-product-icon"
                  src={`${backend_url}${p.image}`}
                  alt={p.name}
                />
                <p className="cartitems-product-title">{p.name}</p>
                <p>
                  {currency}
                  {p.price}
                </p>
                <button className="cartitems-quantity">{qty}</button>
                <p>
                  {currency}
                  {p.price * qty}
                </p>
                <img
                  onClick={() => removeFromCart(p.id)}
                  className="cartitems-remove-icon"
                  src={cross_icon}
                  alt="Remove"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>
                {currency}
                {getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>
                {currency}
                {getTotalCartAmount()}
              </h3>
            </div>
          </div>
          <button className="cart-btn checkout-btn" onClick={handleCheckout}>
            PROCEED TO CHECKOUT
          </button>
          <button className="cart-btn clear-btn" onClick={clearCart}>
            CLEAR CART
          </button>
        </div>
      </div>
    </div>
  );
}
