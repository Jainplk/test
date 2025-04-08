import React, { useContext, useRef } from 'react'
import './Review.css'
import { ListingsContext } from '../../context/ListingContext'

const Review = ({ showListingId }) => {

    const { popupIsClose, handleReviewSubmit, feedback, setFeedback } = useContext(ListingsContext)

    const closeRef = useRef()

    const handlePopup = (e) => {
        if (closeRef.current === e.target) {
            popupIsClose()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        document.body.classList.remove("no-scroll")
        handleReviewSubmit(showListingId)
    }

    return (
        <div className='review-popup' onClick={handlePopup} ref={closeRef}>
                <div className="review-popup-card">
                    <div className="review-popup-heading">
                        <h3>Leave your feedback</h3>
                        <button onClick={popupIsClose}>X</button>
                    </div>
                    <div className="feedback">
                        <label>Feedback :</label>
                        <textarea rows={5} cols={30} placeholder="start typing..." name="feedback" onChange={(e) => setFeedback(e.target.value)} value={feedback}></textarea>
                    </div>
                    <button type='submit' className='feedback-btn' onClick={handleSubmit}>Leave feedback</button>
                </div>
        </div>
    )
}

export default Review
