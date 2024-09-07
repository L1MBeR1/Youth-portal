import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Stack } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsContainer = () => {
	const navigate = useNavigate();
	const [lastPage, setLastPage] = useState(1);

	return (
		<Stack direction={'column'} flexGrow={1} gap={'30px'}>
			<Stack
				direction={'row'}
				justifyContent={'space-between'}
				alignItems={'flex-end'}
			>
				<Typography
					onClick={() => {
						navigate('/news');
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
			</Stack>
		</Stack>
	);
};

export default ProjectsContainer;
