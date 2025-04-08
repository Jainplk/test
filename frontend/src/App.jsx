import React from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import NewListing from './pages/NewListing/NewListing'
import ShowListing from './pages/ShowListing/ShowListing'
import HostListing from './pages/HostListing/HostListing'
import EditListing from './pages/EditListing/EditListing'
import NotFound from './pages/NotFound/NotFound'
import Login from './pages/Login/Login'
import EmailVerify from './pages/EmailVerify/EmailVerify'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import ChatPage from './pages/ChatPage/ChatPage';


const App = () => {
  return (
    <div>
      <Navbar />
      <div className="app">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/new' element={<NewListing />} />
          <Route path='/listing/:id/show' element={<ShowListing />} />
          <Route path='/listing/host' element={<ProtectedRoute><HostListing /></ProtectedRoute>} />
          <Route path='/listing/:id/edit' element={<EditListing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<ProtectedRoute><EmailVerify /></ProtectedRoute>} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/chat' element={<ProtectedRoute><ChatPage/></ProtectedRoute>}/>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer autoClose={2000} hideProgressBar={true} limit={1}/>
    </div>
  )
}

export default App
