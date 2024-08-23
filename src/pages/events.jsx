import React, { useState, useEffect } from 'react';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import Autocomplete from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import IconButton from '@mui/joy/IconButton';
import FormLabel from '@mui/joy/FormLabel';
import { Typography, Stack, Button } from '@mui/joy';
import SearchOffIcon from '@mui/icons-material/SearchOff';

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
	const [filtersCleared, setFiltersCleared] = useState(false);

	const {
		events,
		cities,
		countries,
		refetchEvents,
		refetchCities,
		refetchCountries,
		isLoading,
		isError,
	} = useEventsWithSortData({
		start_date,
		end_date: endDateString,
		per_page,
		country,
		city,
	});

	useEffect(() => {
		if (filtersCleared) {
			refetchEvents();
			setFiltersCleared(false);
		}
	}, [filtersCleared, refetchEvents]);
	const handleRefetch = () => {
		refetchEvents();
	};
	const clearFilters = () => {
		setCountry('');
		setCity('');
		setFiltersCleared(true);
	};
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
			<Stack direction={'column'} spacing={2}>
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
							disableClearable={true}
							placeholder='Выберите страну'
							options={countries || []}
							onChange={(e, value) => {
								setCountry(value);
							}}
							value={country}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Город</FormLabel>
						<Autocomplete
							disableClearable={true}
							placeholder='Выберите город'
							options={cities || []}
							onChange={(e, value) => setCity(value)}
							value={city}
						/>
					</FormControl>
					<IconButton
						variant='outlined'
						onClick={clearFilters}
						color='danger'
						sx={{
							'--IconButton-size': '35px',
						}}
					>
						<SearchOffIcon />
					</IconButton>
					<Button color='primary' onClick={handleRefetch}>
						Найти
					</Button>
				</Box>
				<Stack
					direction={'row'}
					height={'75vh'}
					sx={{
						borderRadius: '30px',
						overflow: 'hidden',
					}}
				>
					{events && (
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
										{events.map((event, index) => (
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
								<Map markers={events} />
							</Stack>
						</>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Events;
