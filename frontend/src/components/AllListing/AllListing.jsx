import React, { useContext } from 'react'
import { ListingsContext } from '../../context/ListingContext'
import { Link } from 'react-router-dom'
import './AllListing.css'

const AllListing = () => {

  const {filteredListing, noSearchResult, handleSearchBar, handleLogoClick } = useContext(ListingsContext)

  return (
    <>
      <div className='listings'>
        {
          filteredListing && filteredListing.map((item, index) => {
            return (
              <div className='listing' key={index}>
                <div className="listings-content">
                  <div className="listings-img">
                    <Link to={`/listing/${item._id}/show`}> <img src={item.image.url} alt={item.image.filename} loading='lazy'/></Link>
                  </div>

                  <div className="listings-price-loaction">
                    <p className='location'>{item.location}, {item.country}</p>
                    <p className='price'><b>&#8377;</b> {item.price.toLocaleString("en-IN")} /<span>night</span></p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      {
        noSearchResult &&
        <div className='no-result-found'>
          <p className='no-result-found-msg'>No listings found for the entered country. <span onClick={handleLogoClick}>Go to Home</span></p>
          <p className='no-result-found-option'>Try searching for:</p>
          <ul>
            <li><button onClick={() => handleSearchBar('Italy')}>Italy</button></li>
            <li><button onClick={() => handleSearchBar('United States')}>United States</button></li>
            <li><button onClick={() => handleSearchBar('Thailand')}>Thailand</button></li>
          </ul>
        </div>
      }
    </>
  )
}

export default AllListing
