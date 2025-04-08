import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {Helmet} from 'react-helmet';
import { ListingsContext } from '../../context/ListingContext';
import { Link } from 'react-router-dom';
import './ShowListing.css'
import Review from '../../components/Review/Review';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import Map from '../../components/Map/Map';
import AboutOwner from '../../components/AboutOwner/AboutOwner';

const ShowListing = () => {

  const { id } = useParams();

  const { showListing, fetchListingData, destroyListing, popupIsOpen, reviewPopup } = useContext(ListingsContext)
  const loginUserId = localStorage.getItem("loginUserId")

  useEffect(() => {
    fetchListingData(id);
  }, [id])

  const handleDelete = () => {
    destroyListing(showListing._id)
  }

  return (
    <>
      <Helmet>
        <title>{showListing?.title ?` ${showListing?.title} | stayEasy` : `Listing | stayEasy` }</title>
      </Helmet>

      <div className='show-listing'>
        <div className="listing-title-img">
          <h2>{showListing?.title}</h2>
          <img src={showListing?.image?.url} alt={showListing?.image?.filename} />
        </div>

        <div className="listing-content">
          <h3>villa in {showListing?.location}, {showListing?.country}</h3>
          <div className="listing-description">
            <p>{showListing?.description}</p>
            <p>&#8377; {showListing?.price?.toLocaleString("en-IN")} / night</p>
            <p><a href="#reviews"><u>{showListing?.reviews ? showListing?.reviews?.length : 0} reviews</u></a></p>
          </div>

          <div className="btns">
            {
              loginUserId === showListing?.owner?._id ? <Link to={`/listing/${id}/edit`}><button>Edit Listing <i className="fa-solid fa-pencil"></i></button></Link> : null
            }

            <button onClick={popupIsOpen}>review Listing<i className="fa-solid fa-star"></i></button>
            {
              loginUserId === showListing?.owner?._id ? <button onClick={handleDelete}>Delete Listing&#10008;</button> : null
            }
          </div>
        </div>
      </div>

      {
        reviewPopup && <Review showListingId={showListing._id} />
      }
      {
        showListing?.reviews?.length > 0 ? <ReviewCard showListingId={showListing._id} /> : ""
      }
      <Map coordinates={showListing?.coordinates?.coordinates} location={showListing?.location} country={showListing?.country} />
      <AboutOwner reviews={Array.isArray(showListing?.reviews) ? showListing.reviews.length : 0}
        owner={showListing?.owner?.name || "Owner"} profileImg={showListing?.owner?.profileImg?.url} />
    </>

  )
}

export default ShowListing
