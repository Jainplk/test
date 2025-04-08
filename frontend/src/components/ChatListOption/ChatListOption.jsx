import React, { useContext } from 'react'
import './ChatListOption.css'
import { ListingsContext } from '../../context/ListingContext'
import { formateTime, formatName } from '../../utils/utils'

const ChatListOption = () => {

    const { chats, handleSelectedChatList, selectedChat, deleteChat } = useContext(ListingsContext);

    return (
        <div className="chat-list-user-section">
            {
              chats?.map((chat, index) => {
                    return (
                        <div className="list-container" key={index}>
                            <div className={selectedChat === chat._id ? "active-chat" : "guest-user-info"} onClick={() => handleSelectedChatList(chat._id)}>
                                <div className='guest-user-name-img'>
                                    <span className='guest-user-img'>
                                        {
                                            chat?.guestId?.profileImg?.url ?
                                                <img src={chat?.guestId?.profileImg?.url} alt="" /> 
                                                :
                                                <p>{chat?.guestId?.name?.charAt(0)?.toUpperCase()}</p>
                                        }
                                    </span>
                                    <p className='guest-name'>
                                        {formatName(chat?.guestId?.name)}
                                    </p>
                                </div>
                                <span className='msg-time'><p>{formateTime(chat?.updatedAt)}</p></span>
                            </div>
                            <span className='trash-icon' onClick={() => deleteChat(chat._id)}><i className="fa-solid fa-trash"></i></span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ChatListOption
