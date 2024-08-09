import React from 'react';

import Stack from '@mui/joy/Stack';

import EventsCartsContainer from '../components/eventContainer/eventsCartsContainer';
import MapContainer from '../components/map/mapContainer';
import { Typography, Box, Grid } from '@mui/joy';
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
				paddingX: { xs: '15px', sm: '20px' },
			}}
		>
			<Grid
				container
				sx={{
					flexGrow: 1,
					paddingTop: { xs: '20px', md: '30px', mdx: '50px' },
					height: { xs: '70vh', md: '90vh' },
					// p: 0,
				}}
			>
				{/* <Stack
				direction={'row'}
				gap={'55px'}
				sx={{
					paddingTop: '50px',
					height: { xs: '50vh', md: '91vh' },
				}}
			> */}
				<Grid
					md={12}
					mdx={7}
					flexGrow={1}
					// sx={{ p: 0 }}
				>
					<Stack
						direction={'column'}
						marginRight={{ md: '0', mdx: '20px' }}
						gap={{ xs: '30px', md: '50px', mdx: '80px' }}
						height={'100%'}
					>
						<Box maxWidth={'600px'}>
							<Typography
								fontSize={'clamp(2.5rem,4vw, 5.5rem)'}
								fontWeight={'700'}
								lineHeight={'1.2'}
								textColor={'black'}
								// sx={{
								// 	fontSize: 'clamp(2.5rem,4vw, 5.5rem)',
								// }}
							>
								Будь в центре событий
							</Typography>
						</Box>
						<HomeCard
							category={'Новость'}
							title={'Фестиваль молодёжи 2024'}
							img={first}
						/>
					</Stack>
				</Grid>
				<Grid
					sx={{
						display: { xs: 'none', md: 'none', mdx: 'grid' },
					}}
					xs={5}
					// sx={{ p: 0 }}
				>
					<Stack direction={'column'} gap={'20px'} height={'100%'}>
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
				</Grid>
			</Grid>
			{/* </Stack> */}
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
