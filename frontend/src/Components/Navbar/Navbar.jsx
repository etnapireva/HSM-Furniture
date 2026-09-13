import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo1 from "../Assets/logo1.png";
import cart_icon from "../Assets/cart_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useWishlist } from "../../Context/WishlistContext";
import { clearTokens } from "../../utils/authUtils";

const Navbar = () => {
  const { getTotalCartItems } = useContext(ShopContext);
  const { getWishlistCount } = useWishlist();
  const menuRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = Boolean(localStorage.getItem("auth-token"));
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const dropdown_toggle = (e) => {
    setOpen((prev) => !prev);
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleLogout = () => {
    clearTokens();
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="nav">
      <Link to="/" className="nav-logo">
        <img src={logo1} alt="HSM Furniture" />
        <p>HSM Furniture</p>
      </Link>
      <img
        onClick={dropdown_toggle}
        className={`nav-dropdown${open ? " open" : ""}`}
        src={nav_dropdown}
        alt="Menu"
      />
      <ul ref={menuRef} className="nav-menu">
        <li className={isActive("/") ? "active" : ""}>
          <Link to="/">Blej</Link>
        </li>
        <li className={isActive("/category/garnitura") ? "active" : ""}>
          <Link to="/category/garnitura">Garnitura</Link>
        </li>
        <li className={isActive("/category/tavolinabuke") ? "active" : ""}>
          <Link to="/category/tavolinabuke">Tavolina buke</Link>
        </li>
        <li className={isActive("/category/dhomagjumi") ? "active" : ""}>
          <Link to="/category/dhomagjumi">Dhoma gjumi</Link>
        </li>
        <li className={isActive("/category/kende") ? "active" : ""}>
          <Link to="/category/kende">Kende</Link>
        </li>
        <li className={isActive("/category/karrika") ? "active" : ""}>
          <Link to="/category/karrika">Karrika</Link>
        </li>
        <li className={isActive("/category/tavolinamesi") ? "active" : ""}>
          <Link to="/category/tavolinamesi">Tavolina mesi</Link>
        </li>
      </ul>
      <div className="nav-login-cart">
        <ThemeToggle />
        {loggedIn ? (
          <>
            <Link className="nav-text-link" to="/dashboard">Llogaria</Link>
            <Link className="nav-text-link" to="/wishlist">
              Dëshirat{getWishlistCount() ? ` (${getWishlistCount()})` : ""}
            </Link>
            <button type="button" className="nav-text-btn" onClick={handleLogout}>
              Dil
            </button>
          </>
        ) : (
          <Link className="nav-login-btn" to="/login">Hyr</Link>
        )}
        <Link to="/cart" className="nav-cart">
          <img src={cart_icon} alt="Shporta" />
          <span className="nav-cart-count">{getTotalCartItems()}</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
