// src/Context/ShopContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../config";
import { cartKey } from "../config";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hsm-cart") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("hsm-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const loadProducts = async () => {
    try {
      const res = await fetch(`${backend_url}/allproducts`);
      const data = await res.json();
      setProducts(data);
      setCartItems((prev) => {
        const next = { ...prev };
        data.forEach((p) => {
          const key = cartKey(p);
          if (next[key] == null) next[key] = 0;
        });
        return next;
      });
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Initialize products & cart
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh products function
  const refreshProducts = () => {
    loadProducts();
  };

  // Add item to cart
  const addToCart = (productId, quantity = 1) => {
    setCartItems((prev) => ({
      ...prev,
      [cartKey(productId)]: (prev[cartKey(productId)] || 0) + quantity,
    }));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => ({
      ...prev,
      [cartKey(productId)]: Math.max((prev[cartKey(productId)] || 0) - 1, 0),
    }));
  };

  // Clear cart
  const clearCart = () => {
    const cleared = {};
    products.forEach((p) => {
      cleared[cartKey(p)] = 0;
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
      const prod = products.find((p) => cartKey(p) === id);
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
