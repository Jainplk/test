import React from 'react'
import AllListing from '../../components/AllListing/AllListing'
import { Helmet } from 'react-helmet'

const Home = () => {


  return (
    <div className='home'>
      <Helmet>
        <title>stayEasy -  Your Travel Companion!</title>
        <meta name="description" content="Discover the best travel experiences with stayEasy. Your ultimate travel companion!" />
      </Helmet>

      <AllListing />
    </div>
  )
}

export default Home
