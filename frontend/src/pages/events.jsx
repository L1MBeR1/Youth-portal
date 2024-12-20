import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import { Box, Button, Grid, Option, Select, Stack, Typography } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import EventFilterDrawer from '../components/drawers/eventFilterDrawer';
import SearchField from '../components/fields/searchField';
import EventCard from '../components/homeComponents/eventContainer/eventCard';
import EventHorizontalCard from '../components/homeComponents/eventContainer/eventHorizontalCard';
import Map from '../components/maps/map';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination';
import useCities from '../hooks/useCities';
import useCountries from '../hooks/useContries';
import useEvents from '../hooks/useEvents';
function Events() {
	const start_date = new Date().toISOString().split('T')[0];
	const end_date = new Date();
	end_date.setMonth(end_date.getMonth() + 12);
	const endDateString = end_date.toISOString().split('T')[0];
	const per_page = 8;
	const [country, setCountry] = useState('');
	const [lastPage, setLastPage] = useState();
	const [page, setPage] = useState(1);
	const [city, setCity] = useState('');
	const [drawerOpen, setDrawerOpen] = useState(false);

	const [orderDir, setOrderDir] = useState('desc');
	const [isNeedRefetch, setIsNeedRefetch] = useState(false);
	const searchFields = ['name'];
	const [searchValue, setSearchValue] = useState('');
	const [searchValues, setSearchValues] = useState([]);
	const { data: events, refetch } = useEvents(setLastPage, {
		page,
		endFrom: start_date,
		endTo: endDateString,
		per_page,
		country,
		city,

		searchFields: searchFields,
		searchValues: searchValues,
		withAuthors: true,
		orderBy: 'created_at',
		orderDir,
	});
	const { data: cities } = useCities();
	const { data: countries } = useCountries();

	useEffect(() => {
		refetch();
	}, [page, refetch]);
	const handleRefetch = () => {
		refetch();
	};

	useEffect(() => {
		if (isNeedRefetch) {
			refetch();
			setIsNeedRefetch(false);
		}
	}, [isNeedRefetch, refetch]);

	const clearSearchValue = () => {
		setSearchValue('');
		setSearchValues([]);
		setIsNeedRefetch(true);
	};
	const applySearchValue = () => {
		setSearchValues([searchValue]);
		setIsNeedRefetch(true);
	};
	const handleSortChange = newValue => {
		setOrderDir(newValue);
		setIsNeedRefetch(true);
	};

	const clearFilters = () => {
		setCountry('');
		setCity('');
		setIsNeedRefetch(true);
	};

	return (
		<Stack
			direction={'column'}
			sx={{ gap: '30px', padding: { xs: '15px', sm: '40px' } }}
		>
			<Box marginTop={{ xs: '15px', md: '25px' }}>
				<Typography level='h1'>Мероприятия</Typography>
			</Box>

			<EventFilterDrawer
				open={drawerOpen}
				setOpen={setDrawerOpen}
				countries={countries}
				cities={cities}
				country={country}
				setCountry={setCountry}
				city={city}
				setCity={setCity}
				clearFilters={clearFilters}
				refetch={handleRefetch}
			/>

			<Stack
				justifyContent={'space-between'}
				sx={{
					flexDirection: { xs: 'column', md: 'row' },
				}}
				gap={3}
			>
				<Stack direction={'row'} spacing={2}>
					<SearchField
						size='sm'
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						onClear={clearSearchValue}
						sx={{ borderRadius: '30px', width: '100%' }}
					/>

					<Button
						color='primary'
						onClick={() => {
							applySearchValue();
						}}
					>
						Найти
					</Button>
				</Stack>
				<Stack
					direction={'row'}
					spacing={2}
					sx={{
						justifyContent: { xs: 'space-between', md: '' },
					}}
				>
					<Button onClick={() => setDrawerOpen(true)}>
						<FilterAltIcon />
					</Button>
					<Select
						variant='plain'
						defaultValue='desc'
						placeholder='Сначала новые'
						endDecorator={<SortIcon />}
						indicator={null}
						color='neutral'
						onChange={(e, newValue) => handleSortChange(newValue)}
					>
						<Option value={'desc'}>Сначала новые</Option>
						<Option value={'asc'}>Сначала старые</Option>
					</Select>
				</Stack>
			</Stack>

			<Box sx={{ display: { xs: 'block', lg: 'none' } }}>
				<Stack direction={'column'} spacing={2}>
					{events && (
						<>
							<Stack
								flexGrow={1}
								sx={{
									height: '50vh',
									borderRadius: '30px',
									overflow: 'hidden',
								}}
							>
								<Map />
							</Stack>
							<Grid container spacing={2}>
								{events.map((event, index) => (
									<Grid xs={12} sm={6} mdx={4} lg={4} key={event.id}>
										<EventCard key={index} data={event} />
									</Grid>
								))}
							</Grid>
							<Pagination
								page={page}
								lastPage={lastPage}
								onPageChange={setPage}
							/>
						</>
					)}
				</Stack>
			</Box>

			<Box sx={{ display: { xs: 'none', lg: 'block' } }}>
				<Stack
					height={'70vh'}
					gap={2}
					sx={{
						flexDirection: 'row',
						borderRadius: '30px',
						overflow: 'hidden',
					}}
				>
					{events && (
						<>
							<Stack
								direction={'column'}
								flexGrow={1}
								spacing={2}
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
									<Stack direction={'column'} spacing={2}>
										{events.map((event, index) => (
											<Grid
												xs={12}
												smx={12}
												mdx={6}
												lgx={4}
												xxl={6}
												key={event.id}
											>
												<EventHorizontalCard key={index} data={event} />
											</Grid>
										))}
									</Stack>
								</Stack>
								<Pagination
									page={page}
									lastPage={lastPage}
									onPageChange={setPage}
								/>
							</Stack>
							<Stack direction={'row'} flexGrow={1}>
								<Map />
							</Stack>
						</>
					)}
				</Stack>
			</Box>
		</Stack>
	);
}

export default Events;
