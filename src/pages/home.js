import React from 'react';

import Box from '@mui/joy/Box';

import MapContainer from '../components/map/mapContainer'
import EventsCartsContainer from '../components/eventContainer/eventsCartsContainer'

import Blank from '../img/blank.png'
function Home() {
  return (
    <div>
      <Box 
      sx={{

        height:{ xs: '50vh', md: '100vh' },
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        backgroundImage: `url(${Blank})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <h2>Домашняя страница</h2>
      </Box>

      <MapContainer/>
      <EventsCartsContainer/>
    </div>
  );
}

export default Home;