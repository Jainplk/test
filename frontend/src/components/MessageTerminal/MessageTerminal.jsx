import React, { useContext, useEffect } from 'react'
import "./MessageTerminal.css"
import { ListingsContext } from '../../context/ListingContext'
import { determineUserRole, formateTime } from '../../utils/utils'
import ChatListSidebar from '../ChatListSidebar/ChatListSidebar'


const MessageTerminal = () => {

  const { message, setMessage, sendMessage, newMessages, selectedChat, handleIsOpenSidebar, guest, currChatId, ownerName, isOpenSidebar } = useContext(ListingsContext)
  const ownerId = localStorage.getItem("showListing")
  const loginUserId = localStorage.getItem("loginUserId")

  const userRole = determineUserRole(loginUserId, ownerId)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (selectedChat || currChatId) {
      sendMessage(selectedChat || currChatId)
    }
  }

  const isSender = (msg) => msg.senderId === loginUserId
  return (
    <>
      <div className='msg-terminal'>
        <div className="msg-terminal-heading">
          {
            userRole === "Host" ? <div className='msg-host-header'>{isOpenSidebar && <ChatListSidebar />}<span onClick={handleIsOpenSidebar}><i className="fa-solid fa-bars"></i> </span><h3>{selectedChat && guest?.name?.charAt(0).toUpperCase() + guest?.name?.slice(1)|| "chat with user"}</h3></div> : <h3>{ownerName?.name}: Listing's Owner</h3>
          }
        </div>

        <div className="msg-container">
          {
            newMessages?.length === 0 ?
              <div className="no-msg">
                {
                  userRole === "Host" ? <p>No message found for this conversation!</p>
                    :
                    <p>No messages yet. Say hello!</p>
                }
              </div> :
              <div className="msg-content">
                {newMessages?.map((newMsg, index) => {
                  return (
                    <div className={isSender(newMsg) ? "sender" : "receiver"} key={index}>
                      <p>{newMsg?.text} <span className='msg-createdAt'>{formateTime(newMsg?.createdAt)}</span></p>

                    </div>
                  )
                })

                }
              </div>

          }
        </div>

        <div className="msg-input-field">
          <form>
            <div className="msg-field">
              <input type="text" placeholder='Type a message...' name='message' value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <button onClick={handleSendMessage}><i className="fa-solid fa-paper-plane"></i></button>
          </form>
        </div>
      </div>
    </>


  )
}

export default MessageTerminal
