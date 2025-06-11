import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShopContextProvider from "./Context/ShopContext";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ShopTabs from "./Pages/ShopTabs";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import AboutUs from "./Components/AboutUs/AboutUs";
import tavolina_banner from "./Components/Assets/tavolina_banner.webp";
import garniture_banner from "./Components/Assets/garniture_banner.png";
import dhomegjumi_banner from "./Components/Assets/dhomegjumi_banner.jpg";
import Hero from "./Components/Hero/Hero";
export const backend_url = "http://localhost:4001";
export const mongodb_url = "http://localhost:4001";
export const mysql_url = "http://localhost:5001";
export const currency = "$";

function App() {
  return (
    <ShopContextProvider>
        <Router>
          <Navbar />

          <Routes>
                <Route path="/" element={<ShopTabs />} />
            <Route
              path="/garniture"
              element={
                <ShopCategory
                  banner={garniture_banner}
                  category="garniture"
                />
              }
            />

            <Route
              path="/tavolinebuke"
              element={
                <ShopCategory
                  banner={tavolina_banner}
                  category="tavolinebuke"
                />
              }
            />

            <Route
              path="/dhomegjumi"
              element={
                <ShopCategory
                  banner={dhomegjumi_banner}
                  category="dhomegjumi"
                />
              }
            />

            <Route path="/product/:productId" element={<Product />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/login" element={<LoginSignup />} />

         <Route
           path="/about"
           element={
             <>
               <Hero />
               <AboutUs/>
             </>
           }
      />

          </Routes>

          <Footer />
        </Router>
      </ShopContextProvider>
  );
}

export default App;