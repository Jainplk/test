import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-heading">
        <h2>It’s easy to list your <br /> home on <span>stayEasy</span></h2>
      </div>

      <div className="header-elements">
        <div className='element'>
        <i className="fa-solid fa-house"></i>
        <p>Create a listing for your <br /> place in just a few steps</p>
        </div>

        <div className='element'>
        <i className="fa-regular fa-clock"></i>
       <p> Go at your own pace, and <br /> make changes whenever</p>
        </div>

        <div className='element'>
        <i className="fa-regular fa-message"></i>
        <p>Get 1:1 support from <br />experienced hosts at any time</p>
        </div>
      </div>

      <div className="header-btn">
      <Link to='/listing/host'><button>Setup your Home <i className="fa-solid fa-house"></i></button></Link>
      </div>
    </div>
  )
}

export default Header
