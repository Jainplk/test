import React, {useContext, useRef, useState} from 'react'
import './OtpInputField.css'
import { ListingsContext } from '../../context/ListingContext';

const OtpInputField = () => {
  

    const {onSubmitOtp, inputRefs} = useContext(ListingsContext)
  
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
    
  return (
    <div className='otp-input-field'>
      <div className="otp-input-field-content">
        <h2>Reset Password OTP</h2>
        <p>Enter the 6-digit code sent to your email id.</p>

        <form onSubmit={onSubmitOtp}>

        <div className="otp-input-field" onPaste={handlePaste}>
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

            <button className='otp-submit-btn'>Submit</button>
        </form>

      </div>
    </div>
  )
}

export default OtpInputField
