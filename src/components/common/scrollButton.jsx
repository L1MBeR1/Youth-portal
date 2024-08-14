import React from 'react';
import Button from '@mui/joy/Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton } from '@mui/joy/';

const ScrollButton = ({ targetRef, type }) => {
	const scrollToRef = () => {
		if (targetRef.current) {
			const targetPosition =
				targetRef.current.getBoundingClientRect().top + window.scrollY;
			const offset = -70;

			window.scrollTo({
				top: targetPosition + offset,
				behavior: 'smooth',
			});
		}
	};

	return (
		<IconButton
			size={'lg'}
			onClick={scrollToRef}
			color={'neutral'}
			variant='soft'
			sx={{
				zIndex: '1000',
				borderRadius: '10px',
				position: 'fixed',
				right: { xs: 10, mdx: '5%', lg: '15%', xl: '20%' },
				top: type === 'top' ? 110 : 'auto',
				bottom: type === 'bottom' ? 80 : 'auto',
			}}
		>
			{type === 'top' && <KeyboardArrowUpIcon />}
			{type === 'bottom' && <KeyboardArrowDownIcon />}
		</IconButton>
	);
};

export default ScrollButton;
