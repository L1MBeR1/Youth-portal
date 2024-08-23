import React, { useState } from 'react';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { Link, useNavigate } from 'react-router-dom';

import EventsCarousel from './eventsCarousel';
// import eventsData from '../../../test/events.json';

import useHomeEvents from '../../../hooks/useHomeEvents';

const EventContainer = () => {
	const navigate = useNavigate();
	const { data: events, isLoading } = useHomeEvents();
	return (
		<Stack direction={'column'} flexGrow={1} gap={'30px'}>
			<Stack
				direction={'row'}
				justifyContent={'space-between'}
				alignItems={'flex-end'}
			>
				<Typography level='h2'>Мероприятия</Typography>
				<Button
					size='sm'
					onClick={() => {
						navigate('events');
					}}
				>
					<Typography level='buttonInv-sm'>Посмотреть ещё</Typography>
				</Button>
			</Stack>
			{!isLoading && <EventsCarousel data={events} />}
		</Stack>
	);
};
export default EventContainer;
