import React, { useEffect, useState } from 'react';
import Grid from '@mui/joy/Grid';
import usePublications from '../hooks/usePublications.js';
import { getPublishedPodcasts } from '../api/podcastsApi.js';
import Box from '@mui/joy/Box';

import PodcastsCard from '../components/publicationsComponents/podcastsCard.jsx';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
function Blogs() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);

	const {
		data: blogs,
		isLoading,
		refetch,
	} = usePublications(['podcasts'], getPublishedPodcasts, setLastPage, {
		page: page,
		per_page: 12,
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
			<h2>Подкасты</h2>
			{isLoading || !blogs ? (
				<></>
			) : (
				<Grid container spacing={4} sx={{ flexGrow: 1 }}>
					{blogs.map(blog => (
						<Grid key={blog.id} xs={6} sm={4} md={3} lg={3} xl={2}>
							<PodcastsCard
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
