import React from 'react';

import Stack from '@mui/joy/Stack';

import { Box, Grid, Typography } from '@mui/joy';
import HomeCard from '../components/homeComponents/homeCard';
import first from '../img/1.webp';
import second from '../img/2.webp';
import third from '../img/3.webp';

import EventContainer from '../components/homeComponents/eventContainer/eventContainer';
import NewsContainer from '../components/homeComponents/newsContainer/newsContainer';
import ProjectsContainer from '../components/homeComponents/projectsContainer/projectsContainer';
function Home() {
	return (
		<Stack
			direction={'column'}
			sx={{
				gap: '7vh',
				paddingX: { xs: '15px', sm: '40px' },
				paddingBottom: '100px',
			}}
		>
			<Grid
				container
				sx={{
					flexGrow: 1,
					paddingTop: { xs: '20px', md: '30px', mdx: '50px' },
					height: { xs: '70vh', md: '90vh' },
				}}
			>
				<Grid md={12} mdx={7} flexGrow={1}>
					<Stack
						direction={'column'}
						marginRight={{ md: '0', mdx: '20px' }}
						gap={{ xs: '30px', md: '50px', mdx: '80px' }}
						height={'100%'}
					>
						<Box maxWidth={'600px'}>
							<Typography level='h1'>Будь в центре событий</Typography>
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
			<EventContainer />
			<NewsContainer />
			<ProjectsContainer />
		</Stack>
	);
}

export default Home;
