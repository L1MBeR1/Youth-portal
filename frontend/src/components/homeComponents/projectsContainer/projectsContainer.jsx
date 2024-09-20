import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IconButton, Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjects from '../../../hooks/useProjects';
import Carousel from '../carousel';
import ProjectCard from './projectCard';

const ProjectsContainer = () => {
	const navigate = useNavigate();
	const { data: projects, isLoading } = useProjects(null, {
		page: 1,
		per_page: 15,
		withAuthors: false,
	});

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
						navigate('/projects');
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
						Проекты
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
						data={projects}
						swiperRef={swiperRef}
						onPrevSlide={handlePrevSlide}
						onNextSlide={handleNextSlide}
						Card={ProjectCard}
					/>
				)}
			</Stack>
		</Stack>
	);
};

export default ProjectsContainer;
