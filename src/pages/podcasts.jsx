import { Stack, Typography } from '@mui/joy';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import React, { useEffect, useState } from 'react';
import { getPublishedPodcasts } from '../api/podcastsApi.js';
import PodcastsCard from '../components/publicationsComponents/podcastsCard.jsx';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
import usePublications from '../hooks/usePublications';
function Podcasts() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);

	const {
		data: news,
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
		<Stack
			direction={'column'}
			sx={{
				padding: { xs: '15px', sm: '40px' },
			}}
		>
			<Box marginTop={{ xs: '15px', md: '25px' }}>
				<Typography level='h1' fontSize={'clamp(3rem,4vw, 5.5rem)'}>
					Подкасты
				</Typography>
			</Box>
			{!isLoading && news && (
				<Grid container spacing={'50px'} sx={{ marginTop: '30px' }}>
					{news.map(news => (
						<Grid xs={6} smx={4} mdx={3} lgx={2} xxl={2} key={news.id}>
							<PodcastsCard data={news} />
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

export default Podcasts;
