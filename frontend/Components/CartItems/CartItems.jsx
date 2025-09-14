// src/Components/CartItems/CartItems.jsx
import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import { authenticatedFetch } from "../../utils/authUtils";

export default function CartItems() {
  const navigate = useNavigate();
  const {
    products,
    cartItems,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Emri është i detyrueshëm";
        if (value.trim().length < 3) return "Shkruani emër të vlefshëm";
        return "";
      case "email": {
        if (!value.trim()) return "Email është i detyrueshëm";
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        return re.test(value) ? "" : "Shkruani email të vlefshëm";
      }
      case "phone": {
        if (!value.trim()) return "Telefoni është i detyrueshëm";
        const digits = value.replace(/[^0-9+]/g, "");
        return digits.length < 8 ? "Numër telefoni i pavlefshëm" : "";
      }
      case "address":
        return value.trim() ? "" : "Adresa është e detyrueshme";
      case "city":
        return value.trim() ? "" : "Qyteti është i detyrueshëm";
      case "postalCode": {
        if (!value.trim()) return "Kodi postar është i detyrueshëm";
        const ok = /^[0-9A-Za-z\-\s]{3,10}$/.test(value.trim());
        return ok ? "" : "Kodi postar i pavlefshëm";
      }
      default:
        return "";
    }
  };

  const validateAll = (data) => {
    const nextErrors = {};
    Object.entries(data).forEach(([name, value]) => {
      if (["note"].includes(name)) return;
      const msg = validateField(name, value);
      if (msg) nextErrors[name] = msg;
    });
    return nextErrors;
  };

  const isFormValid = useMemo(() => Object.keys(validateAll(customer)).length === 0, [customer]);

  const updateField = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const msg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("Ju lutemi kyquni për të vazhduar me porosinë!");
      return;
    }

    const formErrors = validateAll(customer);
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      alert("Ju lutemi plotësoni të dhënat e detyrueshme.");
      return;
    }

    // Gather all items with qty > 0
    const orders = products
      .filter((p) => cartItems[String(p._id ?? p.id)] > 0)
      .map((p) => ({
        product_id:  p._id ?? p.id,
        quantity:    cartItems[String(p._id ?? p.id)],
        total_price: p.price * cartItems[String(p._id ?? p.id)],
        customer,
      }));

    if (orders.length === 0) {
      alert("Nuk ka artikuj në shportë!");
      return;
    }

    try {
      setIsSubmitting(true);
      let orderIds = [];
      
      // Send one POST for each order line using authenticatedFetch
      for (let order of orders) {
        const resp = await authenticatedFetch(`${backend_url}/api/checkout`, {
          method: "POST",
          body: JSON.stringify(order),
        });
        if (!resp.ok) {
          const errBody = await resp.json().catch(() => ({}));
          throw new Error(errBody.error || resp.statusText);
        }
        const result = await resp.json();
        orderIds.push(result.order_id);
      }
      
      // Prepare order data for success page
      const orderData = {
        orderId: orderIds[0], // Use first order ID as main reference
        items: products
          .filter((p) => cartItems[String(p._id ?? p.id)] > 0)
          .map((p) => ({
            name: p.name,
            image: p.image,
            price: p.price,
            quantity: cartItems[String(p._id ?? p.id)],
          })),
        total: getTotalCartAmount(),
        customer: customer,
      };
      
      // Clear cart and redirect to success page
      clearCart();
      navigate("/order-success", { state: { orderData } });
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Gabim gjatë porosisë: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardPay = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("Ju lutemi kyquni për të vazhduar me pagesën!");
      return;
    }

    const formErrors = validateAll(customer);
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      alert("Ju lutemi plotësoni të dhënat e detyrueshme.");
      return;
    }
    const items = products
      .filter((p) => (cartItems[String(p._id)] || 0) > 0)
      .map((p) => ({
        product_id: String(p._id),
        name: p.name,
        amount: p.price,
        quantity: cartItems[String(p._id)],
      }));
    if (items.length === 0) {
      alert("Nuk ka artikuj në shportë!");
      return;
    }
    try {
      setIsSubmitting(true);
      const resp = await authenticatedFetch(`${backend_url}/api/payments/create-checkout-session`, {
        method: "POST",
        body: JSON.stringify({ items, currency: "EUR", customer }),
      });
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); } catch { data = null; }
      if (!resp.ok) {
        const msg = (data && (data.error || data.errors)) || text || "Checkout failed";
        throw new Error(msg);
      }
      if (!data || !data.url) throw new Error("Invalid response from server");
      
      // Store order data in sessionStorage for after Stripe redirect
      const orderData = {
        items: products
          .filter((p) => (cartItems[String(p._id)] || 0) > 0)
          .map((p) => ({
            name: p.name,
            image: p.image,
            price: p.price,
            quantity: cartItems[String(p._id)],
          })),
        total: getTotalCartAmount(),
        customer: customer,
      };
      sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));
      
      window.location.href = data.url;
    } catch (err) {
      console.error("Card pay error:", err);
      alert("Gabim gjatë pagesës: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cartitems">
      <div className="checkout-form">
        <h2>Detajet e Kontaktit dhe Dërgesës</h2>
        <div className="form-row">
          <div className={`form-field ${errors.fullName ? 'invalid' : ''}`}>
            <label htmlFor="fullName">Emri i plotë</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="p.sh. Arben Gashi"
              value={customer.fullName}
              onChange={updateField}
              onBlur={handleBlur}
              autoComplete="name"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>
          <div className={`form-field ${errors.email ? 'invalid' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="p.sh. ju@shembull.com"
              value={customer.email}
              onChange={updateField}
              onBlur={handleBlur}
              autoComplete="email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className={`form-field ${errors.phone ? 'invalid' : ''}`}>
            <label htmlFor="phone">Telefoni</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="p.sh. +383 44 123 456"
              value={customer.phone}
              onChange={updateField}
              onBlur={handleBlur}
              autoComplete="tel"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          <div className={`form-field ${errors.address ? 'invalid' : ''}`}>
            <label htmlFor="address">Adresa</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Rruga, numri, hyrja"
              value={customer.address}
              onChange={updateField}
              onBlur={handleBlur}
              autoComplete="street-address"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className={`form-field ${errors.city ? 'invalid' : ''}`}>
            <label htmlFor="city">Qyteti</label>
            <input
              id="city"
              name="city"
              type="text"
              value={customer.city}
              onChange={updateField}
              onBlur={handleBlur}
              autoComplete="address-level2"
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>
          <div className={`form-field ${errors.postalCode ? 'invalid' : ''}`}>
            <label htmlFor="postalCode">Kodi postar</label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={customer.postalCode}
              onChange={updateField}
              onBlur={handleBlur}
              autoComplete="postal-code"
            />
            {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="note">Shënim (opsionale)</label>
            <textarea
              id="note"
              name="note"
              rows={3}
              placeholder="Preferenca për dorëzim, orari, etj."
              value={customer.note}
              onChange={updateField}
            />
          </div>
        </div>
      </div>
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
        const pid = String(p._id ?? p.id);
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
                  onClick={() => removeFromCart(p._id ?? p.id)}
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
          <button className="cart-btn checkout-btn" onClick={handleCheckout} disabled={!isFormValid || isSubmitting}>
            PROCEED TO CHECKOUT
          </button>
          <button className="cart-btn" onClick={handleCardPay} disabled={!isFormValid || isSubmitting}>
            PAY WITH CARD
          </button>
          <button className="cart-btn clear-btn" onClick={clearCart} disabled={isSubmitting}>
            CLEAR CART
          </button>
        </div>
      </div>
    </div>
  );
}
