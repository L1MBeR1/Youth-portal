import React, { useEffect, useState } from 'react';
import Grid from '@mui/joy/Grid';
import usePublications from '../hooks/usePublications';
import { getPublishedBlogs } from '../api/blogsApi.js';
import Box from '@mui/joy/Box';
import BlogCart from '../components/publicationsComponents/blogCard.jsx';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
import { Typography, Stack } from '@mui/joy';
function Blogs() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);

	const {
		data: blogs,
		isLoading,
		refetch,
	} = usePublications(['blogs'], getPublishedBlogs, setLastPage, {
		page: page,
		per_page: 6,
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
			{/* <Stack
				sx={{
					marginTop: '30px',
				}}
			>
				1
			</Stack> */}
			{!isLoading && blogs && (
				<Grid
					container
					// columnGap={'50px'}
					// rowGap={'50px'}
					spacing={'50px'}
					sx={{ marginTop: '30px' }}
				>
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
