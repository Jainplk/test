import React, { useContext } from 'react'
import "./AboutOwner.css"
import { ListingsContext } from '../../context/ListingContext'
import ThingsToKnow from '../ThingsToKnow/ThingsToKnow'

const AboutOwner = ({ reviews, owner, profileImg }) => {

  const {handleCreateChat} = useContext(ListingsContext)

  return (
    <>
      <div className='owner-info'>
        <hr />
        <h2>Meet your Host</h2>

        <div className="about-host-cohost">
          <div className="about-host">
            <div className="host-profile">
              {
                profileImg ? <img src={profileImg} alt="profile-image" />
                : <div className="no-profile-img"><p>{owner?.charAt(0)?.toUpperCase()}</p></div>
              }
              <h3>{owner?.charAt(0)?.toUpperCase() + owner?.split(" ")[0]?.slice(1)}</h3>
              <p>Host</p>
            </div>

            <div className="host-listing-review">
              <div className='review-info'>
                <h4>{!isNaN(reviews) < 10 ? "0" + reviews : reviews}</h4>
                <p>Reviews</p>
              </div>
              <hr />
              <div className='review-info'>
                <h4>4.4</h4>
                <p>Rating</p>
              </div>
              <hr />
              <div className='review-info'>
                <h4>03</h4>
                <p>Year of Hosting</p>
              </div>

            </div>
          </div>

          <div className="about-host-details">
            <p>Host Deatils</p>

            <div className='detail-info'>
              <p>Response rate: 100%</p>
              <p>Responds within an hour</p>
            </div>

            <button onClick={handleCreateChat}>Message Host</button>

          </div>
        </div>
      </div>

      <hr />
      <ThingsToKnow />
    </>
  )
}

export default AboutOwner
