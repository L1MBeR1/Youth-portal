import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import React, { useEffect, useState } from 'react';
import useProjects from '../hooks/useProjects.js';

import { Stack, Typography } from '@mui/joy';
import ProjectCard from '../components/homeComponents/projectsContainer/projectCard.jsx';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
function Projects() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [orderDir, setOrderDir] = useState('desc');

	const [sortChanged, setSortChanged] = useState(false);

	const {
		data: projects,
		isLoading,
		refetch,
	} = useProjects(setLastPage, {
		page: page,
		per_page: 8,
		withAuthors: true,
	});
	useEffect(() => {
		refetch();
	}, [page, refetch]);

	useEffect(() => {
		if (sortChanged) {
			refetch();
			setSortChanged(false);
		}
	}, [sortChanged, refetch]);

	const handleSortChange = newValue => {
		setOrderDir(newValue);
		setSortChanged(true);
	};

	return (
		<Stack
			direction={'column'}
			sx={{
				padding: { xs: '15px', sm: '40px' },
			}}
		>
			<Box marginTop={{ xs: '15px', md: '25px' }}>
				<Typography level='h1' fontSize={'clamp(3rem,4vw, 5.5rem)'}>
					Проекты
				</Typography>
			</Box>
			<Stack direction={'row'} justifyContent={'flex-end'}>
				{/* <Select
					variant='plain'
					defaultValue='desc'
					placeholder='Сначала новые'
					endDecorator={<SortIcon />}
					indicator={null}
					color='neutral'
					onChange={(e, newValue) => handleSortChange(newValue)}
				>
					<Option value={'desc'}>Сначала новые</Option>
					<Option value={'asc'}>Сначала старые</Option>
				</Select> */}
			</Stack>
			{!isLoading && projects && (
				<Grid container spacing={'50px'} sx={{ marginTop: '30px' }}>
					{projects.map(project => (
						<Grid xs={12} smx={6} mdx={4} lgx={3} xxl={2} key={project.id}>
							<ProjectCard data={project} />
						</Grid>
					))}
				</Grid>
			)}
			<Box
				sx={{
					marginTop: '30px',
				}}
			>
				<Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
			</Box>
		</Stack>
	);
}

export default Projects;
