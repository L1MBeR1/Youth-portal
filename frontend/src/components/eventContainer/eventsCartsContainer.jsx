import React from 'react';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import Carousel from './eventsCarousel';
import EventCart from './eventCart';

import eventsData from '../../test/events.json';

const EventsCartsContainer = () => {
  return (
    <Stack
    sx={{
      margin:{xs:'0 35px',sm:'0 50px'}
    }}
    >
      <Typography level='h2'>
        Все мероприятия
      </Typography>
      <Box>
        <Carousel items=
        {eventsData.map((event, index) => (
          <EventCart key={index} title={event.title} description={event.description}/>
        ))
        } />
      </Box>
    </Stack>
  );
};
export default EventsCartsContainer;
;
