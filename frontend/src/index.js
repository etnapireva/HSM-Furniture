import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ShopContextProvider from "./Context/ShopContext";
import { ThemeProvider } from "./Context/ThemeContext";
import { WishlistProvider } from "./Context/WishlistContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <ShopContextProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </ShopContextProvider>
  </ThemeProvider>
);
