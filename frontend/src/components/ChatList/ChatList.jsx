import React, { useContext, useEffect } from 'react'
import "./ChatList.css"
import { ListingsContext } from '../../context/ListingContext'
import ChatListOption from '../ChatListOption/ChatListOption'


const ChatList = () => {

    const {chats} = useContext(ListingsContext);

  return (
  
    <div className='chat-list'>
      <div className="chat-list-heading">
        <h3>ChatList</h3>
      </div>

        {
            chats?.length === 0 ? <div  className='no-chats'><p>No Chats available</p> </div> : 
            <ChatListOption/>
        }
        
    </div>
  )
}

export default ChatList
