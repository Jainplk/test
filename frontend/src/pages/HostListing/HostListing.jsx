import React, { useContext, useState } from 'react'
import './HostListing.css'
import { ListingsContext } from '../../context/ListingContext';
import { Helmet } from 'react-helmet';

const HostListing = () => {

  const { newlisting, handleChange, handleFileChange, handleSubmit } = useContext(ListingsContext);

  return (
    <div className='host-listing'>

      <Helmet>
        <title>Create New Listing | stayEasy</title>
        <meta name="description" content="Add a new place for guests to book. Describe your property, set the price, and share images on StayEasy." />
      </Helmet>

      <div className="host-listing-content">
        <h3>Setup your Home...</h3>

        <form action='/listings' method='post' encType='multipart/form-data' className='host-listing-form' onSubmit={handleSubmit}>

          <div className='input-field'>
            <label htmlFor="title">Title :</label>
            <input type="text" name="title" value={newlisting.title} onChange={handleChange} id="title" placeholder="Add a catchy title" required />
          </div>

          <div className='input-field'>
            <label htmlFor="description">Description :</label>
            <textarea name="description" value={newlisting.description} onChange={handleChange} id="description" placeholder="start typing..." rows='5' required></textarea>
          </div>

          <div className='input-field'>
            <label htmlFor="image">Upload Listing Image :</label>
            <input type="file" name="image" onChange={handleFileChange} id="image" placeholder="enter image url" required />
          </div>

          <div className="combined-fields">
            <div className='input-field'>
              <label htmlFor="price">Price :</label>
              <input name="price" value={newlisting.price} onChange={handleChange} id="price" placeholder="1200" required />
            </div>

            <div className='input-field'>
              <label htmlFor="country">Country :</label>
              <input type="text" name="country" value={newlisting.country} onChange={handleChange} id="country" placeholder="India" required />
            </div>

          </div>

          <div className='input-field'>
            <label htmlFor="location">Location :</label>
            <input type="text" name="location" value={newlisting.location} onChange={handleChange} id="location" placeholder="Jaipur, Rajasthan" required />
          </div>

          <button type='submit'>Add Listing</button>

        </form>
      </div>
    </div>
  )
}

export default HostListing
