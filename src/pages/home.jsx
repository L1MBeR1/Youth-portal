import React from 'react';

import Stack from '@mui/joy/Stack';

import EventsCartsContainer from '../components/eventContainer/eventsCartsContainer';
import MapContainer from '../components/map/mapContainer';
import { Typography, Box } from '@mui/joy';
import first from '../img/1.png';
import second from '../img/2.jpg';
import third from '../img/3.jpg';
import HomeCard from '../components/homeCard';
function Home() {
	return (
		<Stack
			direction={'column'}
			spacing={4}
			sx={{
				paddingX: '20px',
			}}
		>
			<Stack
				direction={'row'}
				gap={'55px'}
				sx={{
					paddingTop: '50px',
					height: { xs: '50vh', md: '91vh' },
				}}
			>
				<Stack
					direction={'column'}
					gap={'80px'}
					flexGrow={1}
					sx={{
						maxWidth: '55vw',
					}}
				>
					<Box maxWidth={'600px'}>
						<Typography fontSize={'70px'} fontWeight={'700'} lineHeight={'1.2'}>
							Будь в центре событий
						</Typography>
					</Box>
					<HomeCard
						category={'Новости'}
						title={'Фестиваль молодёжи 2024'}
						img={first}
					/>
				</Stack>
				<Stack direction={'column'} gap={'55px'} flexGrow={1}>
					<HomeCard
						category={'Блог'}
						title={'Как организовать свое первое путешествие'}
						img={second}
						isSmall={true}
					/>
					<HomeCard
						category={'Мероприятие'}
						title={'Мастер-класс по фотографии'}
						img={third}
						isSmall={true}
					/>
				</Stack>
			</Stack>
			{/* <Box 
      sx={{

        height:{ xs: '50vh', md: '100vh' },
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        backgroundImage: `url(${Blank})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <h2>Домашняя страница</h2>
      </Box> */}

			<MapContainer />
			<EventsCartsContainer />
		</Stack>
	);
}

export default Home;
