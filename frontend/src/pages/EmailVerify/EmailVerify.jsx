import React, { useContext, useEffect, useRef } from 'react'
import './EmailVerify.css'
import { ListingsContext } from '../../context/ListingContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Helmet } from "react-helmet";
import { use } from 'react'

const EmailVerify = () => {


  const { URL, isLoggedIn, userData } = useContext(ListingsContext)
  axios.defaults.withCredentials = true
  const navigate = useNavigate()

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/")
  }, [isLoggedIn, userData])

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const pasteValue = e.clipboardData.getData("text");
    const pasteArray = pasteValue.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onOtpSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join("")

      const { data } = await axios.post(URL + `/auth/verify-account`, { otp })

      if (data.success) {
        toast.success(data.message)
        userData.isAccountVerified = true
        navigate("/")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='email-verify-page'>
      <Helmet>
        <title>Verify Your Email | stayEasy</title>
        <meta name="description" content="Please verify your email to complete your StayEasy account setup." />
      </Helmet>

      <div className="email-verify-card">
        <h2>Email Verification</h2>
        <p>Enter the 6-digit code sent to your email id.</p>

        <div className="email-verify-form">
          <form onSubmit={onOtpSubmitHandler}>

            <div className="otp-field" onPaste={handlePaste}>
              {
                Array(6).fill(0).map((_, index) => (
                  <input type="text" maxLength={1} key={index} required
                    ref={e => inputRefs.current[index] = e}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))
              }
            </div>

            <button className='email-verify-btn'>Verify Email</button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default EmailVerify
