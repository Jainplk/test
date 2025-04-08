import React from 'react'
import './Footer.css'
import { useLocation } from 'react-router-dom'

const Footer = () => {

  const location = useLocation()

  if(['/login', '/reset-password', '/email-verify'].includes(location.pathname)){
    return null
  }

  return (
    <footer className='footer'>
        <div className="f-info-socials">
            <i className="fa-brands fa-square-facebook"></i>
            <i className="fa-brands fa-square-instagram"></i>
            <i className="fa-brands fa-linkedin"></i>
        </div>
        <div>&copy; stayEasy Private Limited</div>
        <div className="f-info-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
        </div>
      
    </footer>
  )
}

export default Footer
