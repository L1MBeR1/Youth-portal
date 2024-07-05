import React from 'react';
import Carousel from './eventsCarousel';
import eventsData from '../testFiles/events.json';
import EventCart from './eventCart';
const EventsCartsContainer = () => {
  return (
    <div>
      <h2>Все мероприятия</h2>
      <div className='px-5 mx-5'>
      <Carousel items=
      {eventsData.map((event, index) => (
        <EventCart key={index} title={event.title} description={event.description}/>
      ))
      } />
      </div>
    </div>
  );
};
export default EventsCartsContainer;
;
