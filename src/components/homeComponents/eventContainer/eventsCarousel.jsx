import React, { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button, Stack } from '@mui/joy';
import EventCart from './eventCard';

const EventsCarousel = ({ data }) => {
	const swiperRef = useRef(null);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);
	const handlePrevSlide = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slidePrev();
		}
	};

	const handleNextSlide = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slideNext();
		}
	};

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
		<Stack
			direction={'row'}
			flexGrow={1}
			justifyContent={'space-between'}
			spacing={2}
		>
			<Button
				color='primary'
				variant='soft'
				sx={{ maxWidth: '20px' }}
				onClick={handlePrevSlide}
				disabled={isBeginning}
			>
				<KeyboardArrowLeftIcon />
			</Button>
			<Swiper
				ref={swiperRef}
				slidesPerView={1}
				spaceBetween={10}
				pagination={{
					clickable: true,
				}}
				breakpoints={{
					100: {
						slidesPerView: 1,
						spaceBetween: 20,
					},
					700: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					1000: {
						slidesPerView: 3,
						spaceBetween: 30,
					},
					1300: {
						slidesPerView: 4,
						spaceBetween: 30,
					},
					1600: {
						slidesPerView: 5,
						spaceBetween: 40,
					},
				}}
				className='mySwiper'
			>
				{data.map((event, index) => (
					<SwiperSlide key={index}>
						<EventCart data={event} />
					</SwiperSlide>
				))}
			</Swiper>
			<Button
				color='primary'
				variant='soft'
				sx={{ maxWidth: '20px' }}
				onClick={handleNextSlide}
				disabled={isEnd}
			>
				<KeyboardArrowRightIcon />
			</Button>
		</Stack>
	);
};

export default EventsCarousel;
