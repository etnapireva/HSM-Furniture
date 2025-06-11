// src/Context/ShopContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  // Initialize products & cart
  useEffect(() => {
    // 1) Load all products
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        // Build an empty cart skeleton
        const empty = {};
        data.forEach((p) => (empty[p.id] = 0));
        setCartItems(empty);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Add item to cart
  const addToCart = (productId, quantity = 1) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity,
    }));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

  // Clear cart
  const clearCart = () => {
    const cleared = {};
    products.forEach((p) => (cleared[p.id] = 0));
    setCartItems(cleared);
  };

  // Total number of items
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  // Total amount
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const prod = products.find((p) => p.id === Number(id));
      return prod ? sum + prod.price * qty : sum;
    }, 0);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartItems,
        getTotalCartAmount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
