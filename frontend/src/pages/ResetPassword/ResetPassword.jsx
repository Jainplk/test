import React, { useContext, useState } from 'react'
import './ResetPassword.css'
import axios from 'axios'
import EmailInputField from '../../components/EmailInputField/EmailInputField'
import PasswordField from '../../components/PasswordField/PasswordField'
import OtpInputField from '../../components/OtpInputField/OtpInputField'
import { ListingsContext } from '../../context/ListingContext'
import { Helmet } from "react-helmet";

const ResetPassword = () => {

  axios.defaults.withCredentials = true

  const { isEmailSent, isOtpSubmitted } = useContext(ListingsContext)

  return (
    <div className='reset-password-page'>

      <Helmet>
        <title>Reset Your Password | StayEasy</title>
        <meta name="description" content="Securely reset your StayEasy account password." />
      </Helmet>

      {!isEmailSent && <EmailInputField />}

      {!isOtpSubmitted && isEmailSent && <OtpInputField />}

      {isOtpSubmitted && isEmailSent && <PasswordField />}

    </div>
  )
}

export default ResetPassword
