import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'
import logo1 from '../Assets/logo1.png'
import navprofileIcon from '../Assets/nav-profile.svg'

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    navigate('/admin/login');
  };

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo1} alt="HSM Furniture" />
        <p>HSM Furniture</p>
      </div>
      <div className='nav-actions'>
        <button onClick={handleLogout} className='logout-btn'>
          Logout
        </button>
        <img src={navprofileIcon} className='nav-profile' alt="" />
      </div>
    </div>
  )
}

export default Navbar
