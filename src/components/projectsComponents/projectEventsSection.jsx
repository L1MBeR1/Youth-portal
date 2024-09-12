import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton, Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import React, { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventCard from '../homeComponents/eventContainer/eventCard';

const ProjectEventsSection = ({ events }) => {
	const swiperRef = useRef(null);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);

	useEffect(() => {
		if (swiperRef.current && swiperRef.current.swiper) {
			const swiper = swiperRef.current.swiper;

			const updateButtonsState = () => {
				setIsBeginning(swiper.isBeginning);
				setIsEnd(swiper.isEnd);
			};

			swiper.on('slideChange', updateButtonsState);
			updateButtonsState();
			return () => {
				swiper.off('slideChange', updateButtonsState);
			};
		}
	}, []);

	return (
		<Stack direction={'column'} flexGrow={1} gap={'30px'}>
			<Stack
				direction={'row'}
				justifyContent={'space-between'}
				alignItems={'flex-end'}
			>
				<Typography level='publications-h2'>
					<Stack direction={'row'} justifyContent={'center'}>
						Мероприятия проекта
					</Stack>
				</Typography>
				<Box sx={{ display: { xs: 'none', mdx: 'block' } }}>
					<Stack
						direction={'row'}
						spacing={2}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<IconButton
							color='primary'
							variant='solid'
							size='lg'
							sx={{ maxWidth: '20px', borderRadius: '30px' }}
							onClick={() => swiperRef.current.swiper.slidePrev()}
							disabled={isBeginning}
						>
							<KeyboardArrowLeftIcon />
						</IconButton>
						<IconButton
							color='primary'
							variant='solid'
							size='lg'
							sx={{ maxWidth: '20px', borderRadius: '30px' }}
							onClick={() => swiperRef.current.swiper.slideNext()}
							disabled={isEnd}
						>
							<KeyboardArrowRightIcon />
						</IconButton>
					</Stack>
				</Box>
				<Box sx={{ display: { xs: 'block', mdx: 'none' } }}>
					<Stack
						direction={'row'}
						spacing={2}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<IconButton
							color='primary'
							variant='solid'
							size='md'
							sx={{ maxWidth: '20px', borderRadius: '30px' }}
							onClick={() => swiperRef.current.swiper.slidePrev()}
							disabled={isBeginning}
						>
							<KeyboardArrowLeftIcon />
						</IconButton>
						<IconButton
							color='primary'
							variant='solid'
							size='md'
							sx={{ maxWidth: '20px', borderRadius: '30px' }}
							onClick={() => swiperRef.current.swiper.slideNext()}
							disabled={isEnd}
						>
							<KeyboardArrowRightIcon />
						</IconButton>
					</Stack>
				</Box>
			</Stack>

			<Stack direction='row' justifyContent='space-between' alignItems='center'>
				{events && (
					<Swiper
						ref={swiperRef}
						slidesPerView={1}
						spaceBetween={10}
						pagination={{ clickable: true }}
						breakpoints={{
							100: { slidesPerView: 1, spaceBetween: 20 },
							800: { slidesPerView: 1, spaceBetween: 20 },
							1100: { slidesPerView: 2, spaceBetween: 30 },
							1300: { slidesPerView: 3, spaceBetween: 30 },
							1600: { slidesPerView: 3, spaceBetween: 40 },
						}}
						className='mySwiper'
					>
						{events.map((item, index) => (
							<SwiperSlide key={index}>
								<EventCard data={item} />
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</Stack>
		</Stack>
	);
};

export default ProjectEventsSection;
