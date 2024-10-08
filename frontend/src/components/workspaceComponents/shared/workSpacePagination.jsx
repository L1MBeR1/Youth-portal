import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import React from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const Pagination = ({ page, lastPage, onPageChange }) => {
	const handlePreviousPage = () => {
		onPageChange(Math.max(page - 1, 1));
	};

	const handleNextPage = () => {
		onPageChange(page + 1);
	};

	return (
		<>
			<Box
				sx={{
					p: { sx: '1', sm: '2' },
					mb: 1,
					gap: 1,
					display: { xs: 'none', sm: 'flex' },
				}}
			>
				<Button
					size='sm'
					variant='outlined'
					color='primary'
					startDecorator={<KeyboardArrowLeftIcon />}
					onClick={handlePreviousPage}
					disabled={page === 1}
					sx={{
						display: { xs: 'none', sm: 'flex' },
					}}
				>
					Назад
				</Button>
				<IconButton
					size='sm'
					variant='outlined'
					color='primary'
					onClick={handlePreviousPage}
					disabled={page === 1}
					sx={{
						display: { xs: 'flex', sm: 'none' },
					}}
				>
					<KeyboardArrowLeftIcon />
				</IconButton>
				<Box sx={{ flex: 1 }} />
				{[...Array(lastPage)].map((_, index) => {
					const pageNumber = index + 1;
					if (
						pageNumber === 1 ||
						pageNumber === lastPage ||
						(pageNumber >= page - 2 && pageNumber <= page + 2)
					) {
						return (
							<IconButton
								key={pageNumber}
								size='sm'
								variant={page === pageNumber ? 'solid' : 'outlined'}
								color='primary'
								onClick={() => onPageChange(pageNumber)}
								sx={{
									borderRadius: '50%',
								}}
							>
								{pageNumber}
							</IconButton>
						);
					} else if (pageNumber === page - 3 || pageNumber === page + 3) {
						return (
							<Typography key={pageNumber} sx={{ mx: 1 }}>
								...
							</Typography>
						);
					} else {
						return null;
					}
				})}
				<Box sx={{ flex: 1 }} />

				<Button
					size='sm'
					variant='outlined'
					color='primary'
					endDecorator={<KeyboardArrowRightIcon />}
					onClick={handleNextPage}
					disabled={page === lastPage}
					sx={{
						display: { xs: 'none', sm: 'flex' },
					}}
				>
					Вперед
				</Button>
				<IconButton
					size='sm'
					variant='outlined'
					color='primary'
					onClick={handleNextPage}
					disabled={page === 1}
					sx={{
						display: { xs: 'flex', sm: 'none' },
					}}
				>
					<KeyboardArrowRightIcon />
				</IconButton>
			</Box>
			<Box
				sx={{
					p: { sx: '1', sm: '2' },
					mb: 1,
					gap: 1,
					display: { xs: 'flex', sm: 'none' },
				}}
			>
				<Button
					size='sm'
					variant='outlined'
					color='primary'
					startDecorator={<KeyboardArrowLeftIcon />}
					onClick={handlePreviousPage}
					disabled={page === 1}
					sx={{
						display: { xs: 'none', sm: 'flex' },
					}}
				>
					Назад
				</Button>
				<IconButton
					size='sm'
					variant='outlined'
					color='primary'
					onClick={handlePreviousPage}
					disabled={page === 1}
					sx={{
						display: { xs: 'flex', sm: 'none' },
					}}
				>
					<KeyboardArrowLeftIcon />
				</IconButton>
				<Box sx={{ flex: 1 }} />
				{[...Array(lastPage)].map((_, index) => {
					const pageNumber = index + 1;
					if (
						pageNumber === 1 ||
						pageNumber === lastPage ||
						(pageNumber >= page - 1 && pageNumber <= page + 1)
					) {
						return (
							<IconButton
								key={pageNumber}
								size='sm'
								variant={page === pageNumber ? 'solid' : 'outlined'}
								color='primary'
								onClick={() => onPageChange(pageNumber)}
								sx={{
									borderRadius: '50%',
								}}
							>
								{pageNumber}
							</IconButton>
						);
					} else if (pageNumber === page - 2 || pageNumber === page + 2) {
						return (
							<Typography key={pageNumber} sx={{ mx: 1 }}>
								...
							</Typography>
						);
					} else {
						return null;
					}
				})}
				<Box sx={{ flex: 1 }} />

				<Button
					size='sm'
					variant='outlined'
					color='primary'
					endDecorator={<KeyboardArrowRightIcon />}
					onClick={handleNextPage}
					disabled={page === lastPage}
					sx={{
						display: { xs: 'none', sm: 'flex' },
					}}
				>
					Вперед
				</Button>
				<IconButton
					size='sm'
					variant='outlined'
					color='primary'
					onClick={handleNextPage}
					disabled={page === 1}
					sx={{
						display: { xs: 'flex', sm: 'none' },
					}}
				>
					<KeyboardArrowRightIcon />
				</IconButton>
			</Box>
		</>
	);
};

export default Pagination;
