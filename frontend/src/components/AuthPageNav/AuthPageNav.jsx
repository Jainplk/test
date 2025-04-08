import React from 'react'
import './AuthPageNav.css'
import { useNavigate } from 'react-router-dom';

const AuthPageNav = () => {

    const navigate = useNavigate()

  return (
    <div className='auth-page-nav'>
      <div className="auth-page-content">
      <div className="auth-page-nav-logo" onClick={() => navigate('/')}>
      <i className="fa-regular fa-compass"></i>
      <p>stayEasy</p>
      </div>
      </div>
    </div>
  )
}

export default AuthPageNav
