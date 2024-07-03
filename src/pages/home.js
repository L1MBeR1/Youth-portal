import React from 'react';
import MapContainer from '../components/mapContainer'
import EventsCartsContainer from '../components/eventsCartsContainer'
function Home() {
  return (
    <div>
      <h2>Страница гостя</h2>
      <MapContainer/>
      <EventsCartsContainer/>
    </div>
  );
}

export default Home;