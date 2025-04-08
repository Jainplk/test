import React, { useContext, useEffect, useState } from 'react'
import './ProfilePage.css'
import { ListingsContext } from '../../context/ListingContext'
import { useNavigate } from 'react-router-dom'
import EditProfilePopup from '../../components/EditProfilePopup/EditProfilePopup'
import { Helmet } from "react-helmet";
import { formatName } from '../../utils/utils'

const ProfilePage = () => {

  const [dropdown, setDropdown] = useState(false)

  const handleDropdown = () => {
    setDropdown(!dropdown)
  }

  const navigate = useNavigate()
  const { userData, sendVerificationOtp, logout, isLoggedIn, editProfilePopup, handleEditPopupIsOpen, handleDeleteProfile } = useContext(ListingsContext)

  useEffect(() => {
    !isLoggedIn && !userData && navigate('/')
  }, [userData, isLoggedIn])

  return (
      <div className='profile-page'>

      <Helmet>
        <title>Your Profile | stayEasy</title>
        <meta name="description" content="View and manage your StayEasy profile, listings, reviews, and more." />
      </Helmet>

        <div className="profile-page-container1">
          <div className="img-container">
            {
              userData?.profileImg?.url ?
                <div className="user-img"><img src={userData?.profileImg?.url} alt={userData.profileImg.filename} /></div>
                :
                <div className="user-name-letter"><p>{userData?.name?.charAt(0)?.toUpperCase()}</p></div>
            }
          </div>

          <div className="account-info">
            <div className="verified-info">
              {userData?.isAccountVerified ?
                <p><i className="fa-solid fa-circle-check"></i> Verified</p> :
                <>
                  <p onClick={() => sendVerificationOtp()}><i className="fa-solid fa-circle-xmark"></i> Verify your Account</p> <span className='dropdown-btn' onClick={handleDropdown}><i className="fa-solid fa-caret-down"></i></span>
                </>}
            </div>

            <div className="docs-info">
              <h4> {formatName(userData?.name)} provided</h4>

              <ul className="docs-list">
                <li><i className="fa-regular fa-circle-check"></i> Government ID</li>
                <li><i className="fa-regular fa-circle-check"></i> Email Address</li>
                <li><i className="fa-regular fa-circle-check"></i> Phone Number</li>
                <li><i className="fa-regular fa-circle-check"></i> Work Email</li>
              </ul>
            </div>

            {dropdown && <div className="docs-info-dropdown">
              <h4>{userData?.name?.split(" ")[0]} provided</h4>

              <ul className="dropdown-docs-list">
                <li><i className="fa-regular fa-circle-check"></i> Government ID</li>
                <li><i className="fa-regular fa-circle-check"></i> Email Address</li>
                <li><i className="fa-regular fa-circle-check"></i> Phone Number</li>
                <li><i className="fa-regular fa-circle-check"></i> Work Email</li>
              </ul>
            </div>}
          </div>
        </div>

        <div className="profile-page-container2">
          <div className="about-info">
            <h2>Hii, I'm {formatName(userData?.name)}</h2>
            <p>Joined in {userData?.joinedAt?.split("-")[0]}</p>
          </div>

          <div className='info-about-user'>
            <p>{userData?.about}</p>
          </div>

          <div className="buttons">
            <button className='edit' onClick={handleEditPopupIsOpen}>Edit profile</button>
            <button className='logout' onClick={logout}>Logout profile</button>
            <button className='delete' onClick={handleDeleteProfile}>Delete profile</button>
          </div>
        </div>

        {editProfilePopup && <EditProfilePopup />}

      </div>
  )
}

export default ProfilePage
