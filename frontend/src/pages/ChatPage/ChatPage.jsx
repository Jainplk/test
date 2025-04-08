import React from 'react'
import ChatList from '../../components/ChatList/ChatList'
import MessageTerminal from '../../components/MessageTerminal/MessageTerminal'
import "./ChatPage.css"
import { Helmet } from "react-helmet"

const ChatPage = () => {

  const loginUserId = localStorage.getItem("loginUserId")
  const listingOwnerId = localStorage.getItem("showListing")

  return (
    <div className='chats'>
      <Helmet>
        <title>Host & Guest | StayEasy</title>
      </Helmet>

      {
        listingOwnerId === loginUserId && <ChatList />
      }

      <MessageTerminal />
    </div>
  )
}

export default ChatPage
