import React from 'react'
import './NotFound.css'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";

const NotFound = () => {
  return (
    <div className='not-found'>

      <Helmet>
        <title>Page Not Found | stayEasy</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist." />
      </Helmet>


      <div className="err-content">
        <div className="error-msg">
          <h1>Oops!</h1>
          <p>We can't seem to find the page you're looking for</p>
        </div>

        <div className="link-code">
          <h3>Error code: 404</h3>
          <p>Let’s get you back on track.  <span><Link to='/'>Home</Link></span></p>
        </div>
      </div>

      <div className="error-cartoon">
        <img src="/404.jpg" alt="404-img" />
      </div>

    </div>
  )
}

export default NotFound
