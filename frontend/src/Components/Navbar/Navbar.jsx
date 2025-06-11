import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo1 from "../Assets/logo1.png";
import cart_icon from "../Assets/cart_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png";

const Navbar = () => {
  let [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const navigate = useNavigate();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("refresh-token");
    navigate("/");
  };

  return (
    <div className="nav">
      <Link to="/" onClick={() => setMenu("shop")} style={{ textDecoration: "none" }} className="nav-logo">
        <img src={logo1} alt="logo" />
        <p>HSM Furniture</p>
      </Link>
      <img onClick={dropdown_toggle} className="nav-dropdown" src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu("shop")}><Link to="/" style={{ textDecoration: "none" }}>Blej</Link>{menu === "shop" ? <hr /> : <></>}</li>
        <li onClick={() => setMenu("garniture")}><Link to="/garniture" style={{ textDecoration: "none" }}>Garnitura</Link>{menu === "garniture" ? <hr /> : <></>}</li>
        <li onClick={() => setMenu("tavolinebuke")}><Link to="/tavolinebuke" style={{ textDecoration: "none" }}>Tavolina buke</Link>{menu === "tavolinebuke" ? <hr /> : <></>}</li>
        <li onClick={() => setMenu("dhomegjumi")}><Link to="/dhomegjumi" style={{ textDecoration: "none" }}>Dhoma gjumi</Link>{menu === "dhomegjumi" ? <hr /> : <></>}</li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" style={{ textDecoration: "none" }}><button>Login</button></Link>
        )}
        <Link to="/cart"><img src={cart_icon} alt="cart" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;