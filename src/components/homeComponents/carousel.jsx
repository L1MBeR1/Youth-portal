import React, { useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

const Carousel = ({ data, swiperRef, onPrevSlide, onNextSlide, Card }) => {
	useEffect(() => {
		if (swiperRef.current && swiperRef.current.swiper) {
			const swiper = swiperRef.current.swiper;

			const updateButtonsState = () => {
				onPrevSlide(swiper.isBeginning);
				onNextSlide(swiper.isEnd);
			};

			swiper.on('slideChange', updateButtonsState);
			updateButtonsState();
			return () => {
				swiper.off('slideChange', updateButtonsState);
			};
		}
	}, [onPrevSlide, onNextSlide, swiperRef]);

	return (
		<Swiper
			ref={swiperRef}
			slidesPerView={1}
			spaceBetween={10}
			pagination={{
				clickable: true,
			}}
			breakpoints={{
				100: {
					slidesPerView: 1.5,
					spaceBetween: 20,
				},
				800: {
					slidesPerView: 2.5,
					spaceBetween: 20,
				},
				1100: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				1300: {
					slidesPerView: 3.5,
					spaceBetween: 30,
				},
				1600: {
					slidesPerView: 4.5,
					spaceBetween: 40,
				},
			}}
			className='mySwiper'
		>
			{data.map((item, index) => (
				<SwiperSlide key={index}>
					<Card data={item} />
				</SwiperSlide>
			))}
		</Swiper>
	);
};

export default Carousel;
