import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
  iconUrl: "/home.png", 
  iconSize: [40, 40], 
  iconAnchor: [20, 40], 
  popupAnchor: [0, -40], 
});

const Map = ({ coordinates }) => {

  const position = coordinates && coordinates.length === 2
    ? [coordinates[1], coordinates[0]] 
    : [20, 78];

  return (
    <div id='map' style={{padding:"40px 0", zIndex:"1"}}>
      <hr />
      <h3 style={{ margin: "30px 0", fontSize: "30px", fontWeight: "400", color:"#222"}}>Where you'll be</h3>
      <MapContainer center={position} zoom={13} style={{ height: "450px", width: "100%", boxShadow: "0 1px 8px rgb(52, 7, 10),0 4px 12px rgba(0,0,0,0.05)", borderRadius: "5px", zIndex:"1"}}>

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={position} icon={customIcon}>
          <Popup>Exact loaction provided after booking</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default Map
