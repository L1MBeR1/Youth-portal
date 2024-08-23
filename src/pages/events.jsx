import React, { useState } from 'react';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import Autocomplete from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import { Typography, Stack, Button } from '@mui/joy';

import Map from '../components/maps/map';
import EventCard from '../components/homeComponents/eventContainer/eventCard';
import useEventsWithSortData from '../hooks/useEventsWithSortData';

function Events() {
	const start_date = new Date().toISOString().split('T')[0];
	const end_date = new Date();
	end_date.setMonth(end_date.getMonth() + 2);
	const endDateString = end_date.toISOString().split('T')[0];
	const per_page = 10;

	const [country, setCountry] = useState('');
	const [city, setCity] = useState('');

	const [events, cities, countries] = useEventsWithSortData({
		start_date,
		end_date: endDateString,
		per_page,
		country,
		city,
	});

	return (
		<Stack
			direction={'column'}
			sx={{
				gap: '30px',
				padding: { xs: '15px', sm: '40px' },
			}}
		>
			<Box marginTop={{ xs: '15px', md: '25px' }}>
				<Typography level='h1'>Мероприятия</Typography>
			</Box>
			<Stack direction={'column'}>
				<Box
					sx={{
						borderRadius: 'sm',
						display: { xs: 'none', sm: 'flex' },
						flexWrap: 'wrap',
						alignItems: 'flex-end',
						gap: 1.5,
					}}
				>
					<FormControl>
						<FormLabel>Страна</FormLabel>
						<Autocomplete
							placeholder='Выберете страну'
							options={countries.data}
						/>
						{/* <FormHelperText>A description for the combo box.</FormHelperText> */}
					</FormControl>
					<FormControl>
						<FormLabel>Город</FormLabel>
						<Autocomplete placeholder='Выберете город' options={cities.data} />
						{/* <FormHelperText>A description for the combo box.</FormHelperText> */}
					</FormControl>
					<Button color='primary'>Найти</Button>
				</Box>
				<Stack
					direction={'row'}
					height={'75vh'}
					sx={{
						borderRadius: '30px',
						overflow: 'hidden',
					}}
				>
					{events.data && (
						<>
							<Stack
								direction={'column'}
								flexGrow={1}
								sx={{
									maxWidth: '50%',
								}}
							>
								<Stack
									flexGrow={1}
									sx={{
										paddingRight: '20px',
										overflowY: 'scroll',
									}}
								>
									<Grid container spacing={2}>
										{events.data.map((event, index) => (
											<Grid
												xs={12}
												smx={6}
												mdx={6}
												lgx={4}
												xxl={6}
												key={event.id}
											>
												<EventCard key={index} data={event} />
											</Grid>
										))}
									</Grid>
								</Stack>
							</Stack>
							<Stack direction={'column'} flexGrow={1}>
								<Map markers={events.data} />
							</Stack>
						</>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Events;
