import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = (props) => {
  return (
    <MapContainer center={[63,90]} zoom={3} attributionControl={false} style={{ height: '60vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.markers.map((marker, index) => (
        <Marker key={index} position={[marker.coordinates.latitude, marker.coordinates.longitude]}>
          <Popup>
            <h4>{marker.title}</h4>
            <p>{marker.description}</p>
          </Popup>
        </Marker>
      ))}
      
    </MapContainer>
  );
};

export default Map;
