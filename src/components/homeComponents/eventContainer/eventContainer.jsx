import React, { useState } from 'react';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import EventVerticalCarousel from './eventVerticalCarousel';
import EventsHorizontalCarousel from './eventsHorizontalCarousel';
import eventsData from '../../../test/events.json';
import Map from '../../map/map';

import useEvents from '../../../hooks/useEvents';

const EventContainer = () => {
	const [events, setEvents] = useState(eventsData);
	return (
		<Stack direction={'column'} flexGrow={1} gap={'30px'}>
			<Typography level='h2'>Мероприятия</Typography>
			<Stack
				gap={'20px'}
				sx={{
					flexDirection: { xs: 'column', mdx: 'row' },
					// height: { xs: '40vh', mdx: '60vh' },
				}}
			>
				<Stack
					sx={{
						width: { xs: '100%', mdx: '35%' },
						maxWidth: { xs: '100%', mdx: '35%' },
						borderRadius: '30px',
						overflow: 'hidden',
						display: { xs: 'none', mdx: 'block' },
					}}
				>
					<Map markers={events} />
				</Stack>
				<Box
					sx={{
						width: '65%',
						maxWidth: '65%',
						display: { xs: 'none', mdx: 'block' },
					}}
				>
					<EventsHorizontalCarousel data={events} />
				</Box>
				<Box
					sx={{
						width: '100%',
						display: { xs: 'block', mdx: 'none' },
					}}
				>
					<EventsHorizontalCarousel data={events} />
				</Box>
			</Stack>
		</Stack>
	);
};
export default EventContainer;
