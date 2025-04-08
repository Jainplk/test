import React, { useContext } from 'react'
import './PasswordField.css'
import { ListingsContext } from '../../context/ListingContext'

const PasswordField = () => {

  const {newPassword, setNewPassword, onSubmitNewPassword} = useContext(ListingsContext)

  return (
    <div className='password-input-field'>
      <div className="password-input-field-content">
        <h2>New Password</h2>
        <p>Enter the new password.</p>

        <form onSubmit={onSubmitNewPassword}>
            <div className="password-field" tabIndex={1}>
            <span><i className="fa-solid fa-lock"></i></span>
            <input type="password" placeholder='Enter new password' name='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} required/>
            </div>

            <button className='password-submit-btn'>Reset Password</button>
        </form>

      </div>
    </div>
  )
}

export default PasswordField
