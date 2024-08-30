import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/joy/';
import React, { useEffect, useState } from 'react';

const ScrollButton = ({ type }) => {
	const [isVisible, setIsVisible] = useState(false);

	const handleScroll = () => {
		const scrollPosition = window.scrollY;
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;

		const upperThreshold = 500;
		const lowerThreshold = 500;
		if (type === 'top') {
			setIsVisible(scrollPosition > upperThreshold);
		} else if (type === 'bottom') {
			setIsVisible(
				scrollPosition + windowHeight < documentHeight - lowerThreshold
			);
		}
	};

	const scrollToPosition = () => {
		if (type === 'top') {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		} else if (type === 'bottom') {
			window.scrollTo({
				top: document.documentElement.scrollHeight,
				behavior: 'smooth',
			});
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [type]);

	return (
		<IconButton
			size={'lg'}
			onClick={scrollToPosition}
			color={'neutral'}
			variant='soft'
			sx={{
				zIndex: '500',
				borderRadius: '10px',
				position: 'fixed',
				right: { xs: 10, mdx: '5%', lg: '15%', xl: '20%' },
				top: type === 'top' ? 110 : 'auto',
				bottom: type === 'bottom' ? 80 : 'auto',
				transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
				pointerEvents: isVisible ? 'auto' : 'none',
			}}
		>
			{type === 'top' && <KeyboardArrowUpIcon />}
			{type === 'bottom' && <KeyboardArrowDownIcon />}
		</IconButton>
	);
};

export default ScrollButton;
