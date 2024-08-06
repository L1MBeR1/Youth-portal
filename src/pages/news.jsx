import React, { useEffect, useState } from 'react';
import Grid from '@mui/joy/Grid';
import usePublishedNews from '../hooks/usePublishedNews.js';
import { getPublishedNews } from '../api/newsApi.js';
import Box from '@mui/joy/Box';

import NewsCard from '../components/publicationsComponents/newsCard.jsx';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
function Blogs() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);

	const {
		data: blogs,
		isLoading,
		refetch,
	} = usePublishedNews(['news'], getPublishedNews, setLastPage, {
		page: page,
		per_page: 6,
		withAuthors: true,
	});
	useEffect(() => {
		refetch();
	}, [page, refetch]);
	return (
		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				marginX: { xs: '10px', md: '10%', lg: '15%' },
			}}
		>
			<h2>Новости</h2>
			{isLoading || !blogs ? (
				<></>
			) : (
				<Grid container spacing={6} sx={{ flexGrow: 1 }}>
					{blogs.map(blog => (
						<Grid key={blog.id} xs={12} sm={6} md={6} lg={4}>
							<NewsCard
								id={blog.id}
								title={blog.title}
								description={blog.description.desc}
								img={blog.cover_uri}
								creator={blog.nickname}
								createDate={blog.created_at}
							/>
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
		</Box>
	);
}

export default Blogs;
