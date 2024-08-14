import React, { useEffect, useState } from 'react';
import Grid from '@mui/joy/Grid';
import usePublications from '../hooks/usePublications';
import { getPublishedBlogs } from '../api/blogsApi.js';
import Box from '@mui/joy/Box';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import BlogCart from '../components/publicationsComponents/blogCard.jsx';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
import { Typography, Stack } from '@mui/joy';
import SortIcon from '@mui/icons-material/Sort';
function Blogs() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);

	const {
		data: blogs,
		isLoading,
		refetch,
	} = usePublications(['blogs'], getPublishedBlogs, setLastPage, {
		page: page,
		per_page: 8,
		withAuthors: true,
	});
	useEffect(() => {
		refetch();
	}, [page, refetch]);
	return (
		<Stack
			direction={'column'}
			sx={{
				padding: { xs: '15px', sm: '20px' },
			}}
		>
			<Box marginTop={{ xs: '15px', md: '25px' }}>
				<Typography level='h1' fontSize={'clamp(3rem,4vw, 5.5rem)'}>
					Блоги
				</Typography>
			</Box>
			<Stack direction={'row'} justifyContent={'flex-end'}>
				<Select
					variant='plain'
					defaultValue='asc'
					placeholder='Сначала новые'
					endDecorator={<SortIcon />}
					indicator={null}
					color='neutral'
				>
					<Option value={'asc'}>Сначала новые</Option>
					<Option value={'desc'}>Сначала старые</Option>
				</Select>
			</Stack>
			{!isLoading && blogs && (
				<Grid container spacing={'50px'} sx={{ marginTop: '30px' }}>
					{blogs.map(blog => (
						<Grid item xs={12} smx={6} mdx={4} lgx={3} xxl={2} key={blog.id}>
							<BlogCart data={blog} />
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

export default Blogs;
