import React, { useContext} from 'react'
import './EmailInputField.css'
import { ListingsContext } from '../../context/ListingContext'

const EmailInputField = () => {

  const { email, setEmail, onEmailSubmit} = useContext(ListingsContext)

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    onEmailSubmit(email)
  }

  return (
    <div className='email-input-field'>
      <div className="email-input-field-content">
        <h2>Reset Password</h2>
        <p>Enter your registered email addresss.</p>
        <form onSubmit={handleEmailSubmit}>
            <div className="email-field" tabIndex={1}>
            <span><i className="fa-regular fa-envelope"></i></span>
            <input type="email" placeholder='Email Id' name='email' value={email} onChange={e => setEmail(e.target.value)} required/>
            </div>

            <button className='email-submit-btn'>Submit</button>
        </form>

      </div>
    </div>
  )
}

export default EmailInputField
