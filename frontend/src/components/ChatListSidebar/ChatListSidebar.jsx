import React, { useContext } from 'react'
import "./ChatListSidebar.css"
import { ListingsContext } from '../../context/ListingContext'
import ChatListOption from '../ChatListOption/ChatListOption'


const ChatListSidebar = () => {

  const { chats, handleIsCloseSidebar } = useContext(ListingsContext);

  return (
    <div className='sidebar-chatList'>
      <div className="sidebar-header">
        <h3 className='sidebar-heading'>ChatList</h3>
        <i className="fa-solid fa-xmark" onClick={handleIsCloseSidebar}></i>
      </div>

      <div className="sidebar-user-section">
        {
          chats.length === 0 ? <div className='sidebar-no-chats'><p>No Chats available</p> </div> :
            <ChatListOption/>
        }
      </div>
    </div>

  )
}

export default ChatListSidebar
