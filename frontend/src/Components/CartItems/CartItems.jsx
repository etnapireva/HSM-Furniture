// src/Components/CartItems/CartItems.jsx

import React, { useContext } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { mongodb_url, mysql_url, currency } from "../../App";

const CartItems = () => {
  const {
    products,
    cartItems,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
  } = useContext(ShopContext);

  // 1) Kontroll për artikuj në shportë
  const hasItems = Object.values(cartItems).some((qty) => qty > 0);

  // 2) Funksioni i checkout-it: dërgon POST në MySQL, pastaj pastrohet shporta
  const handleCheckout = async () => {
    const orders = products
      .filter((p) => {
        const pid = String(p.id);
        return cartItems[pid] > 0;
      })
      .map((p) => {
        const pid = String(p.id);
        return {
          product_id: p.id,
          quantity: cartItems[pid],
          total_price: p.price * cartItems[pid],
          user_id: 1,
        };
      });

    if (orders.length === 0) {
      alert("Nuk ka artikuj në shportë!");
      return;
    }

    try {
      for (let order of orders) {
        const res = await fetch(`${mysql_url}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      alert("Porosia u ruajt me sukses!");
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë porosisë: " + err.message);
    }
  };

  if (!hasItems) {
    return (
      <div className="empty-cart-message">
        <h2>Nuk ka artikuj në shportë për porosi.</h2>
      </div>
    );
  }

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
                {/* 3) Shto prefix për imazhin */}
                <img
                  className="cartitems-product-icon"
                  src={`${mongodb_url}${p.image}`}
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
          {/* 4) Shto butonin e checkout-it */}
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
          <button onClick={clearCart}>CLEAR CART</button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
