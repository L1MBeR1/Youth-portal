import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Typography } from '@mui/joy';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function DatePopOver({ label, fromDate, toDate, setFromDate, setToDate }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [value, setValue] = useState('Выберите даты');

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	useEffect(() => {
		if (fromDate && toDate) {
			setValue(`От: ${fromDate}    До: ${toDate}`);
		} else if (fromDate) {
			setValue(`От: ${fromDate}`);
		} else if (toDate) {
			setValue(`До: ${toDate}`);
		} else {
			setValue('Выберите даты');
		}
	}, [fromDate, toDate]);

	const popover = open && (
		<Sheet
			variant='outlined'
			sx={{
				position: 'absolute',
				top: anchorEl
					? anchorEl.getBoundingClientRect().bottom + window.scrollY + 10
					: 0,
				left: anchorEl
					? anchorEl.getBoundingClientRect().left + window.scrollX
					: 0,
				zIndex: 1300,
				bgcolor: 'background.paper',
				boxShadow: 24,
				p: 2,
				borderRadius: 6,
			}}
		>
			<Sheet>
				<Stack spacing={1}>
					<Typography level='title-sm'>{label}</Typography>
					<FormControl size='sm'>
						<FormLabel>От</FormLabel>
						<Input
							type='date'
							value={fromDate}
							onChange={e => setFromDate(e.target.value)}
						/>
					</FormControl>
					<FormControl size='sm'>
						<FormLabel>До</FormLabel>
						<Input
							type='date'
							value={toDate}
							onChange={e => setToDate(e.target.value)}
						/>
					</FormControl>
				</Stack>
			</Sheet>
		</Sheet>
	);

	return (
		<>
			<FormControl size='sm'>
				<FormLabel>{label}</FormLabel>
				<Input
					readOnly
					onClick={handleClick}
					value={value}
					endDecorator={
						<KeyboardArrowDownIcon
							sx={{
								transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.3s',
							}}
						/>
					}
					sx={{
						width: 260,
					}}
				/>
			</FormControl>
			{ReactDOM.createPortal(popover, document.getElementById('root'))}
			{open && (
				<div
					onClick={handleClose}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
					}}
				/>
			)}
		</>
	);
}

export default DatePopOver;
