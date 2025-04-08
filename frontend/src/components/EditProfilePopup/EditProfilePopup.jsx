import React, { useContext, useRef } from 'react'
import './EditProfilePopup.css'
import { ListingsContext } from '../../context/ListingContext'

const EditProfilePopup = () => {

    const { userData, handleEditPopupIsClose, handleEditProfileSubmit, editProfile, handleProfileChanges, handleProfileImgChanges, previewProfileImg } = useContext(ListingsContext)

    const closeRef = useRef()

    const handlePopup = (e) => {
        if (closeRef.current === e.target) {
            handleEditPopupIsClose()
        }
    }

    return (
        <>
            {
                userData.isAccountVerified ? (<div className='edit-profile-popup' onClick={handlePopup} ref={closeRef}>
                    <div className="edit-form-container">
                        <div className="edit-form-heading">
                            <h3>Edit your Profile</h3>
                        </div>

                        <div className="edit-form-content">
                            <form onSubmit={handleEditProfileSubmit}>
                                <div className="image-field">
                                    <div className="image-preview">
                                        <div className="image-div">
                                            {
                                                previewProfileImg ? <img src={previewProfileImg} alt="" /> :
                                                    userData?.profileImg?.url ? <img src={userData?.profileImg?.url} alt={userData?.profileImg?.filename} />
                                                        :
                                                        <p className='username-first-letter'>{userData?.name?.charAt(0)?.toUpperCase()}</p>
                                            }
                                        </div>
                                        <p className='verfy-status'><i className="fa-solid fa-circle-check"></i> Verified</p>
                                    </div>

                                    <div className="image-input-field">
                                        <input type="file" id='profileImg' name='profileImg' onChange={handleProfileImgChanges} />
                                    </div>
                                </div>

                                <div className="about-field">
                                    <label htmlFor="about">ABOUT:</label>
                                    <textarea name="about" id="about"
                                        rows={8} value={editProfile?.about || ""}
                                        onChange={handleProfileChanges}></textarea>
                                </div>

                                <div className="edit-profile-btns">
                                    <button>Submit</button>
                                    <button onClick={handleEditPopupIsClose}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>) : (
                    <div className='edit-profile-popup' onClick={handlePopup} ref={closeRef}>
                        <div className="edit-form-container">
                            <div className="edit-form-heading">
                                <h3>Edit your Profile</h3>
                            </div>

                            <div className="edit-form-content">
                                <p className='not-verified'>Your account is not verified yet. Please verify your account to edit your profile.</p>
                                <button onClick={handleEditPopupIsClose}>Close</button>
                            </div>
                        </div>
                    </div>)
            }
        </>
    )
}

export default EditProfilePopup
