import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo1 from "../Assets/logo1.png";
import cart_icon from "../Assets/cart_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useWishlist } from "../../Context/WishlistContext";
import { clearTokens } from "../../utils/authUtils";

const Navbar = () => {
  const { getTotalCartItems } = useContext(ShopContext);
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = Boolean(localStorage.getItem("auth-token"));
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  const handleLogout = () => {
    closeMenu();
    clearTokens();
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="nav">
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        <img src={logo1} alt="HSM Furniture" />
        <p>HSM Furniture</p>
      </Link>

      <ul className={`nav-menu${open ? " nav-menu-visible" : ""}`}>
        <li className={isActive("/") ? "active" : ""}>
          <Link to="/" onClick={closeMenu}>Blej</Link>
        </li>
        <li className={isActive("/category/garnitura") ? "active" : ""}>
          <Link to="/category/garnitura" onClick={closeMenu}>Garnitura</Link>
        </li>
        <li className={isActive("/category/tavolinabuke") ? "active" : ""}>
          <Link to="/category/tavolinabuke" onClick={closeMenu}>Tavolina buke</Link>
        </li>
        <li className={isActive("/category/dhomagjumi") ? "active" : ""}>
          <Link to="/category/dhomagjumi" onClick={closeMenu}>Dhoma gjumi</Link>
        </li>
        <li className={isActive("/category/kende") ? "active" : ""}>
          <Link to="/category/kende" onClick={closeMenu}>Kende</Link>
        </li>
        <li className={isActive("/category/karrika") ? "active" : ""}>
          <Link to="/category/karrika" onClick={closeMenu}>Karrika</Link>
        </li>
        <li className={isActive("/category/tavolinamesi") ? "active" : ""}>
          <Link to="/category/tavolinamesi" onClick={closeMenu}>Tavolina mesi</Link>
        </li>
        {loggedIn ? (
          <>
            <li className="nav-mobile-only">
              <Link to="/dashboard" onClick={closeMenu}>Llogaria</Link>
            </li>
            <li className="nav-mobile-only">
              <Link to="/wishlist" onClick={closeMenu}>
                Dëshirat{getWishlistCount() ? ` (${getWishlistCount()})` : ""}
              </Link>
            </li>
            <li className="nav-mobile-only">
              <button type="button" className="nav-text-btn" onClick={handleLogout}>Dil</button>
            </li>
          </>
        ) : (
          <li className="nav-mobile-only">
            <Link to="/login" onClick={closeMenu}>Hyr</Link>
          </li>
        )}
      </ul>

      <div className="nav-login-cart">
        <ThemeToggle />
        {loggedIn ? (
          <>
            <Link className="nav-text-link nav-desktop-only" to="/dashboard">Llogaria</Link>
            <Link className="nav-text-link nav-desktop-only" to="/wishlist">
              Dëshirat{getWishlistCount() ? ` (${getWishlistCount()})` : ""}
            </Link>
            <button type="button" className="nav-text-btn nav-desktop-only" onClick={handleLogout}>
              Dil
            </button>
          </>
        ) : (
          <Link className="nav-login-btn nav-desktop-only" to="/login">Hyr</Link>
        )}
        <Link to="/cart" className="nav-cart" onClick={closeMenu}>
          <img src={cart_icon} alt="Shporta" />
          <span className="nav-cart-count">{getTotalCartItems()}</span>
        </Link>
        <button
          type="button"
          className={`nav-hamburger${open ? " open" : ""}`}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
