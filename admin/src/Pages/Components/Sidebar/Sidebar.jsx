import React from 'react'
import './Sidebar.css'
import add_product_icon from '../Assets/Product_Cart.svg'
import list_product_icon from '../Assets/Product_list_icon.svg'
import logo1 from '../Assets/logo1.png'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className='sidebar'>
      {/* Logo Section */}
      <div className='sidebar-logo'>
        <img src={logo1} alt="HSM Furniture" />
        <p>HSM Furniture</p>
        <span>Admin Panel</span>
      </div>
      
      <Link to='/' style={{ textDecoration: 'none' }}>
        <div className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
          <img src={add_product_icon} alt="" />
          <p>Dashboard</p>
        </div>
      </Link>
      
      <Link to='/addproduct' style={{ textDecoration: 'none' }}>
        <div className={`sidebar-item ${isActive('/addproduct') ? 'active' : ''}`}>
          <img src={add_product_icon} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      
      <Link to='/listproduct' style={{ textDecoration: 'none' }}>
        <div className={`sidebar-item ${isActive('/listproduct') ? 'active' : ''}`}>
          <img src={list_product_icon} alt="" />
          <p>Product List</p>
        </div>
      </Link>
      
      <Link to='/orders' style={{ textDecoration: 'none' }}>
        <div className={`sidebar-item ${isActive('/orders') ? 'active' : ''}`}>
          <img src={list_product_icon} alt="" />
          <p>Orders</p>
        </div>
      </Link>
      
      <Link to='/notifications' style={{ textDecoration: 'none' }}>
        <div className={`sidebar-item ${isActive('/notifications') ? 'active' : ''}`}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}>🔔</span>
          <p>Notifications</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar
