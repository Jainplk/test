import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useLocation } from 'react-router-dom'
import AuthPageNav from '../AuthPageNav/AuthPageNav'
import { useContext } from 'react'
import { ListingsContext } from '../../context/ListingContext'

const Navbar = () => {

  const location = useLocation()
  const currPath = location.pathname;
  const token = localStorage.getItem("token")
  const [searchQuery, setSearchQuery] = useState("");
  const closeListOptionRef = useRef(null)

  const { userData, logout, showListOption, setShowListOption, isLoggedIn, handleSearchBar, handleLogoClick, handleCloseListOption } = useContext(ListingsContext)


  const handleSearch = (e) => {
    e.preventDefault();
   
    handleSearchBar(searchQuery)
    setSearchQuery("")
  }

  const handleOpenListOption = () => {
    setShowListOption((prev) => !prev); // Toggle the value of showListOption
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      setTimeout(() => {
        if (closeListOptionRef.current && !closeListOptionRef.current.contains(event.target)) {
          setShowListOption(false)
        }
      }, 500);
    };

    if (showListOption) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showListOption]);

  if (['/login', '/reset-password', '/email-verify'].includes(currPath)) {
    return <AuthPageNav />
  }

  return (
    <>
      <div className='navbar'>
        <div className="navbar-container">
          <div className="navbar-content">
            <Link to='/'>
              <div className="navbar-logo" onClick={handleLogoClick}>
                <i className="fa-regular fa-compass"></i>
                <p>stayEasy</p>
              </div>
            </Link>

            {
              currPath === '/' ?
                <div className="navbar-search-bar">
                  <input type="search" placeholder='search destination' name='country' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  <button type='submit' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
                :
                ""
            }

            {
              currPath === '/login' ? ''
                :
                <div className="navbar-right">
                  <ul className='navbar-right-list'>
                    {
                      currPath === '/listing/host' ?
                        null
                        :
                        <Link to='/new'> <li className='nav-list-1'>Host your Home</li></Link>
                    }
                  </ul>

                  <div className='nav-user-section'>
                    <div className="nav-user-content" onClick={handleOpenListOption}>
                      {
                          token ? (
                          userData?.profileImg?.url ? (
                            <div className="user-profile-img">
                              <img src={userData.profileImg.url} alt="User Profile" />
                            </div>
                          ) : (
                            <div className="user-profile">
                              <p>{userData?.name?.charAt(0).toUpperCase()}</p>
                            </div>
                          )
                        ) : (
                          <div className="guest-profile">
                            <i className="fa-solid fa-circle-user"></i>
                          </div>
                        )
                      }


                      <i className="fa-solid fa-bars"></i>
                    </div>

                    {showListOption &&(
                      <div className="user-content-list" ref={closeListOptionRef}>
                        <ul>
                          <li onClick={() => handleCloseListOption('/login')}><Link to='/login' state={{ mode: "Sign Up" }}>Sign Up</Link></li>
                          <li onClick={() => handleCloseListOption('/login')}><Link to='/login' state={{ mode: "Sign Up" }}>Login</Link></li>
                          {
                            isLoggedIn && userData && <li onClick={() => handleCloseListOption('/profile')}><Link to='/profile'>Profile Setting</Link></li>
                          }
                        </ul>
                        <hr />
                        <ul>
                          <li onClick={() => handleCloseListOption('/new')}><Link to='/new'>Host your Home</Link></li>
                          {
                            isLoggedIn && userData && <li onClick={logout}>Logout</li>
                          }
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
            }
          </div>
        </div>
      </div>

      {
        currPath === '/' ?
          <div className="dropped-searchBar">
            <div className="navbar-search-bar">
              <input type="search" placeholder='search destination' name='country' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <button type='submit' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>
          :
          ""

      }
    </>
  )
}

export default Navbar
