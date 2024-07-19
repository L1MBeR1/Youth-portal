import React, { useState} from 'react';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import Map from './map';
import eventsData from '../../testFiles/events.json';

const MapContainer = () => {
    const [events, setEvents] = useState(eventsData);
    // const regionSelectRef = useRef(null);
    // const citySelectRef = useRef(null);
    // const categorySelectRef = useRef(null);
    // const datepickerRef = useRef(null);


    // function findEvents() {
    //     const selectedRegion = regionSelectRef.current.value;
    //     const selectedCity = citySelectRef.current.value;
    //     const selectedCategory = categorySelectRef.current.value;

    //     const filtered = eventsData.filter(event => {
    //         const matchesRegion = selectedRegion === '' || event.region === selectedRegion;
    //         const matchesCity = selectedCity === '' || event.city === selectedCity;
    //         const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    //         return matchesRegion && matchesCity && matchesCategory;
    //     });
    //     setEvents(filtered);
    // }

    // function cancelFilters() {
    //     regionSelectRef.current.value = '';
    //     citySelectRef.current.value = '';
    //     categorySelectRef.current.value = '';

    //     M.FormSelect.init(regionSelectRef.current, {});
    //     M.FormSelect.init(citySelectRef.current, {});
    //     M.FormSelect.init(categorySelectRef.current, {});

    //     setEvents(eventsData);
    // }

    return (
        <Stack
        sx={{
            margin:{xs:'0 25px',sm:'0 50px'}
          }}>
            <Typography level="h2">
                Карта мероприятий
            </Typography>
            <Box>
            <Map markers={events}/>
            </Box>
        </Stack>
    );
};
export default MapContainer;
