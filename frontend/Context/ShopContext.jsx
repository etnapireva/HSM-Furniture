// src/Context/ShopContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  // Function to load products
  const loadProducts = async () => {
    try {
      const res = await fetch(`${backend_url}/allproducts`);
      const data = await res.json();
      setProducts(data);
      
      // Build an empty cart skeleton using normalized ids
      const empty = {};
      data.forEach((p) => {
        const key = String(p._id ?? p.id);
        empty[key] = 0;
      });
      setCartItems(empty);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Initialize products & cart
  useEffect(() => {
    loadProducts();
  }, []);

  // Refresh products function
  const refreshProducts = () => {
    loadProducts();
  };

  // Add item to cart
  const addToCart = (productId, quantity = 1) => {
    setCartItems((prev) => ({
      ...prev,
      [String(productId)]: (prev[String(productId)] || 0) + quantity,
    }));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => ({
      ...prev,
      [String(productId)]: Math.max((prev[String(productId)] || 0) - 1, 0),
    }));
  };

  // Clear cart
  const clearCart = () => {
    const cleared = {};
    products.forEach((p) => {
      const key = String(p._id ?? p.id);
      cleared[key] = 0;
    });
    setCartItems(cleared);
  };

  // Total number of items
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  // Total amount
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      if (!qty) return sum;
      const prod = products.find((p) => String(p._id ?? p.id) === id);
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
        refreshProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
