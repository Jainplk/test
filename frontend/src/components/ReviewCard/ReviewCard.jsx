import React, { useContext } from 'react'
import './ReviewCard.css'
import { ListingsContext } from '../../context/ListingContext'

const ReviewCard = ({ showListingId }) => {

    const { showListing, deleteReview, isLoggedIn} = useContext(ListingsContext)
    const loginUserId = localStorage.getItem("loginUserId")

    return (
        <div className='reviews' id='reviews'>
            <hr />
            <h3>Reviews of Our Guests</h3>
            <div>
                <div className="reviews-card" >
                    {showListing?.reviews?.map((review, index) => {
                        return (
                            <div className="reviews-card-content" key={index}>
                                <div className="date-img-username">
                                    { 
                                         isLoggedIn && review?.user ? 
                                            (
                                                review?.user?.profileImg?.url ?(
                                                    <div className="userImg">
                                                    <img src={review?.user?.profileImg?.url} alt="" />
                                                </div> 
                                                ) : (
                                                    <div className='username-img'>
                                                        <p>{review?.user?.name?.charAt(0).toUpperCase()}</p>
                                                    </div>
                                                    )
                                       
                                            ):<div className="guest-profile">
                                            <i className="fa-solid fa-circle-user"></i>
                                          </div>
                                        
                                    }

                                    <div className="username-date">
                                        <h4>{review?.user?.name ? review?.user?.name?.charAt(0).toUpperCase() + review.user?.name?.slice(1): "unknown"}</h4>
                                        <p>{review?.createdAt?.split("T")[0]}</p>
                                    </div> 
                                </div>

                                <div className="feedback">
                                    <p>{review?.feedback}</p>
                                </div>
                                {
                                    isLoggedIn && loginUserId === review?.user?._id ? <button onClick={() => deleteReview(showListingId, review._id)}>Delete Review</button> : null
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ReviewCard
