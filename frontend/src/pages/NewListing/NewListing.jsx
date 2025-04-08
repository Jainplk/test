import React from 'react'
import Header from '../../components/Header/Header'
import {Helmet} from 'react-helmet'

const NewListing = () => {
  return (
    <div>
    <Helmet>
      <title>Setup your Home | stayEasy</title>    
      <meta name="description" content="Set up listing."/>
      </Helmet>
      <Header/>
    </div>
  )
}

export default NewListing
