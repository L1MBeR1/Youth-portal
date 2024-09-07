import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IconButton } from '@mui/joy';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHomeEvents from '../../../hooks/useHomeEvents';
import Carousel from '../carousel';
import EventCard from './eventCard';

const EventContainer = () => {
	const navigate = useNavigate();
	const { data: events, isLoading } = useHomeEvents();

	const swiperRef = useRef(null);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);

	const handlePrevSlide = isBeginningState => {
		setIsBeginning(isBeginningState);
	};

	const handleNextSlide = isEndState => {
		setIsEnd(isEndState);
	};

	return (
		<Stack direction={'column'} flexGrow={1} gap={'30px'}>
			<Stack
				direction={'row'}
				justifyContent={'space-between'}
				alignItems={'flex-end'}
			>
				<Typography
					onClick={() => {
						navigate('/events');
					}}
					level='h2'
					sx={{
						transition: 'color 0.2s',
						cursor: 'pointer',
						'&:hover': {
							color: 'var(--joy-palette-main-primary)',
						},
					}}
				>
					<Stack
						direction={'row'}
						justifyContent={'center'}
						sx={{
							'&:hover svg': {
								color: 'var(--joy-palette-main-primary)',
							},
						}}
					>
						Мероприятия
						<NavigateNextIcon
							sx={{
								transition: 'color 0.2s',
							}}
						/>
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
				{!isLoading && (
					<Carousel
						data={events}
						swiperRef={swiperRef}
						onPrevSlide={handlePrevSlide}
						onNextSlide={handleNextSlide}
						Card={EventCard}
					/>
				)}
			</Stack>
		</Stack>
	);
};

export default EventContainer;
