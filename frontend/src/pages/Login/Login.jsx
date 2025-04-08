import React, { useContext, useState } from 'react'
import './Login.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { ListingsContext } from '../../context/ListingContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const Login = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const initialMode = location.state?.mode || "Login";
  const from = location.state?.from || localStorage.getItem("from") || '/'

  const { setIsLoggedIn, URL} = useContext(ListingsContext)

  const [state, setState] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {

      axios.defaults.withCredentials = true

      if (state === 'Sign Up') {
        const response = await axios.post(URL + `/auth/register`, { email, name, password });

        if (response.data.success) {
          toast.success(response.data.message)
          setIsLoggedIn(true)
          setState("Login")
          setEmail('');
          setName("")
          setPassword('')
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(URL + `/auth/login`, { email, password });
      
        if (response.data.success) {
          toast.success(response.data.message)
          localStorage.removeItem("from")
          navigate(from)
          setIsLoggedIn(true)

          localStorage.setItem("token", response.data.token)
          localStorage.setItem("loginUserId", response.data.userId)
          setEmail("")
          setPassword('')
        } else {
          toast.error(response.data.message)
        }

      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='login-signup-page'>

      <Helmet>
        <title>{state === 'Sign Up' ? "Create an Account | stayEasy" : "Login to Your Account | stayEasy"}</title>
        <meta name="description" content="Login and signup to access your StayEasy account, manage listings, chat with hosts, and more." />
      </Helmet>

      <div className='form-content'>
        <h2>{state === 'Sign Up' ? "Create Account" : "Login"}</h2>
        <p>{state === 'Sign Up' ? "Create your account" : "Login to your account"}</p>

        <form onSubmit={onSubmitHandler}>
          {
            state === 'Sign Up' && (
              <div className='form-field' tabIndex={1}>
                <span><i className="fa-regular fa-user"></i></span>
                <input type="text" placeholder='Rahul Kumar' name='name' value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )
          }

          <div className='form-field' tabIndex={2}>
            <span><i className="fa-regular fa-envelope"></i></span>
            <input type="email" placeholder='email@gmail.com' name='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className='form-field' tabIndex={3}>
            <span><i className="fa-solid fa-lock"></i></span>
            <input type="password" placeholder='********' name='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <p className='forget-password' onClick={() => navigate("/reset-password")}>Forget Password?</p>

          <button className='login-signup-btn'>{state}</button>
        </form>

        {
          state === 'Sign Up' ?
            (<p className='account-info'>Already have an account? <span onClick={() => setState("Login")}>Login here</span></p>)
            :
            (<p className='account-info'>Don't have an account? <span onClick={() => setState("Sign Up")}>Sign up</span></p>)
        }

      </div>
    </div>
  )
}

export default Login
