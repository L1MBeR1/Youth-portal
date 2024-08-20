import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Button, Stack } from '@mui/joy';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EventHorizontalCart from './eventHorizontalCart';

const EventVerticalCarousel = ({ data }) => {
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
			direction={'column'}
			flexGrow={1}
			justifyContent={'space-between'}
			spacing={2}
			sx={{
				maxHeight: '100%',
			}}
		>
			<Button
				variant='soft'
				sx={{ maxHeight: '20px' }}
				onClick={handlePrevSlide}
				disabled={isBeginning}
			>
				<KeyboardArrowUpIcon />
			</Button>
			<Swiper
				ref={swiperRef}
				direction={'vertical'}
				slidesPerView={3}
				spaceBetween={10}
				pagination={{
					clickable: true,
				}}
				className='mySwiper'
			>
				{data.map((event, index) => (
					<SwiperSlide key={index}>
						<EventHorizontalCart data={event} />
					</SwiperSlide>
				))}
			</Swiper>
			<Button
				variant='soft'
				sx={{ maxHeight: '20px' }}
				onClick={handleNextSlide}
				disabled={isEnd}
			>
				<KeyboardArrowDownIcon />
			</Button>
		</Stack>
	);
};

export default EventVerticalCarousel;
