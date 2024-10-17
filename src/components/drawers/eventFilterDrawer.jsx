import {
	Autocomplete,
	Box,
	Button,
	DialogTitle,
	Drawer,
	FormControl,
	FormLabel,
	ModalClose,
	Stack,
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
			<ModalClose />
			<DialogTitle sx={{ maxWidth: '70%' }}>
				Фильтры для мероприятий
			</DialogTitle>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					padding: '20px',
				}}
			>
				{countries && (
					<FormControl>
						<FormLabel>Страна</FormLabel>
						<Autocomplete
							placeholder='Выберите страну'
							options={countries}
							onChange={(e, value) => setCountry(value)}
							value={country}
							size='sm'
						/>
					</FormControl>
				)}
				{cities && (
					<FormControl>
						<FormLabel>Город</FormLabel>
						<Autocomplete
							placeholder='Выберите город'
							options={cities}
							onChange={(e, value) => setCity(value)}
							value={city}
							size='sm'
						/>
					</FormControl>
				)}
				<Stack direction={'row'} spacing={2}>
					<Button
						variant='outlined'
						onClick={clearFilters}
						color='danger'
						sx={{
							flexGrow: 1,
						}}
					>
						Очистить
					</Button>
					<Button
						color='primary'
						onClick={handleRefetch}
						sx={{
							flexGrow: 1,
						}}
					>
						Найти
					</Button>
				</Stack>
			</Box>
		</Drawer>
	);
}

export default EventFilterDrawer;
