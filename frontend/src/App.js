import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ShopTabs from "./Pages/ShopTabs";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import AboutUs from "./Components/AboutUs/AboutUs";
import Wishlist from "./Pages/Wishlist";
import UserDashboard from "./Pages/UserDashboard";
import Orders from "./Pages/Orders";
import OrderSuccess from "./Pages/OrderSuccess";
import garniture_banner from "./Components/Assets/garniture_banner.png";
import tavolina_banner from "./Components/Assets/tavolina_banner.webp";
import dhomegjumi_banner from "./Components/Assets/dhomegjumi_banner.jpg";
import { Toaster } from "react-hot-toast";
import { backend_url, currency } from "./config";

export { backend_url, currency };

function categoryPage(banner, category) {
  return <ShopCategory key={category} banner={banner} category={category} />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ShopTabs />} />
        <Route path="/shop" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/category/garnitura" element={categoryPage(garniture_banner, "garnitura")} />
        <Route path="/category/tavolinabuke" element={categoryPage(tavolina_banner, "tavolinabuke")} />
        <Route path="/category/dhomagjumi" element={categoryPage(dhomegjumi_banner, "dhomagjumi")} />
        <Route path="/category/kende" element={categoryPage(garniture_banner, "kende")} />
        <Route path="/category/karrika" element={categoryPage(tavolina_banner, "karrika")} />
        <Route path="/category/tavolinamesi" element={categoryPage(tavolina_banner, "tavolinamesi")} />
        <Route path="/garniture" element={<Navigate to="/category/garnitura" replace />} />
        <Route path="/tavolinebuke" element={<Navigate to="/category/tavolinabuke" replace />} />
        <Route path="/dhomegjumi" element={<Navigate to="/category/dhomagjumi" replace />} />
      </Routes>
      <Footer />
      <Toaster position="top-center" toastOptions={{ style: { maxWidth: "min(360px, 92%)" } }} />
    </Router>
  );
}

export default App;
