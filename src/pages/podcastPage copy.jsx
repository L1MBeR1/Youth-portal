import Box from '@mui/joy/Box';
import React from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../components/players/audio/AudioPlayer';
import usePodcastById from '../hooks/usePodcastById';

function PodcastPage() {
	const { id } = useParams();
	const { data, isFetching } = usePodcastById(id);
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

		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				marginX: { xs: '10px', md: '10%', lg: '15%' },
			}}
		>
			{/* Секция-заголовок */}

			{/* Секция плеера */}
			{/* <div>  */}

			<br />
			<br />
			<AudioPlayer
				styles={{ marginTop: '20px', marginBottom: '20px' }}
				// filename={"gena.mp3"}
				filename={'hotel_pools_melt.mp3'}
				title={'Название подкаста'}
				contentName=''
				contentId={''}
				// pictureURL={"https://images.unsplash.com/photo-1722808333348-1b61caa91203?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
				pictureURL={''}
				audioUrl={''}
			/>
			{/* </div> */}

			<br />
			<br />
			<br />


			{/* <AudioPlayerMini
				// filename={"gena.mp3"}
				filename={'hotel_pools_melt.mp3'}
				title={'Название подкаста'}
				contentName=''
				contentId={''}
				// pictureURL={"https://images.unsplash.com/photo-1722808333348-1b61caa91203?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
				pictureURL={''}
			/> */}
		</Box>
	);
}

export default PodcastPage;
