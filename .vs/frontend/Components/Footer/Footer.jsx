import React from 'react'
import './Footer.css'

import logo1 from '../Assets/logo1.png'
import instagram_icon from '../Assets/instagram_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'
import location_logo from '../Assets/location_logo.png'

import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={logo1} alt="" />
        <p>HSM Furniture</p>
      </div>
      
      <div className="footer-social-icons">
  <div className="footer-icons-container">
    <a href="https://www.instagram.com/mobileria_hsm/" target="_blank" rel="noopener noreferrer">
      <img src={instagram_icon} alt="Instagram" />
    </a>
  </div>
  <div className="footer-icons-container">
    <a href="https://www.google.com/maps/place/Mobileria+HSM/@42.617204,21.1670997,17z/data=!3m1!4b1!4m6!3m5!1s0x13549d004cc2e87f:0xc7eb3210dd7bcf28!8m2!3d42.617204!4d21.1696746!16s%2Fg%2F11wbcyx42r?entry=ttu&g_ep=EgoyMDI1MDYwNC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
      <img src={location_logo} alt="Location" />
    </a>
  </div>
  <div className="footer-icons-container">
    <a href="https://wa.me/38348502203" target="_blank" rel="noopener noreferrer">
      <img src={whatsapp_icon} alt="WhatsApp" />
    </a>
  </div>
    
</div>

      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2025 - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
