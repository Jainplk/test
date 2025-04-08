import React from 'react'
import './ThingsToKnow.css'

const ThingsToKnow = () => {
  return (
    <div className='things-to-know'>
     <h2>Things to Know</h2>

     <div className="things-to-know-options">
        <div className='house-rules'>
            <h3>House rules</h3>
            <ul>
                <li>Check-in after 2:00 pm</li>
                <li>Checkout before 11:00 am</li>
                <li>15 guests maximum</li>
            </ul>
        </div>

        <div className='safety-property'>
            <h3>Safety & property</h3>
            <ul>
                <li>Carbon monoxide alarm not reported</li>
                <li>Smoke alarm not reported</li>
                <li>Exterior security cameras on property</li>
            </ul>
        </div>

        <div className='cancellation-policy'>
            <h3>Cancellation policy</h3>
            <ul>
                <li>This reservation is non-refundable.</li>
                <li>Cleaning fees are refunded if you cancel before check-in.</li>
                <li></li>
            </ul>
        </div>
     </div>
    </div>
  )
}

export default ThingsToKnow
