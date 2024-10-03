import SearchOffIcon from '@mui/icons-material/SearchOff';
import {
	Autocomplete,
	Box,
	Button,
	Drawer,
	FormControl,
	FormLabel,
} from '@mui/joy';
import React from 'react';

function EventFilterDrawer({
	open,
	setOpen,
	countries,
	cities,
	country,
	setCountry,
	city,
	setCity,
	clearFilters,
	refetch,
}) {
	const handleRefetch = () => {
		refetch();
		setOpen(false);
	};
	return (
		<Drawer open={open} onClose={() => setOpen(false)} anchor='left' size='sm'>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					padding: '20px',
				}}
			>
				<FormControl>
					<FormLabel>Страна</FormLabel>
					<Autocomplete
						disableClearable
						placeholder='Выберите страну'
						options={countries || []}
						onChange={(e, value) => setCountry(value)}
						value={country}
					/>
				</FormControl>
				<FormControl>
					<FormLabel>Город</FormLabel>
					<Autocomplete
						disableClearable
						placeholder='Выберите город'
						options={cities || []}
						onChange={(e, value) => setCity(value)}
						value={city}
					/>
				</FormControl>
				<Button variant='outlined' onClick={clearFilters} color='danger'>
					<SearchOffIcon />
				</Button>
				<Button color='primary' onClick={handleRefetch}>
					Найти
				</Button>
			</Box>
		</Drawer>
	);
}

export default EventFilterDrawer;
