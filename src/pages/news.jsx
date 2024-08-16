import React, { useEffect, useState } from 'react';
import Grid from '@mui/joy/Grid';
import usePublications from '../hooks/usePublications';
import { getPublishedNews } from '../api/newsApi.js';
import Box from '@mui/joy/Box';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import NewsCard from '../components/publicationsComponents/newsCard.jsx';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
import { Typography, Stack } from '@mui/joy';
import SortIcon from '@mui/icons-material/Sort';
function News() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [orderDir, setOrderDir] = useState('desc');

	const [sortChanged, setSortChanged] = useState(false);

	const {
		data: news,
		isLoading,
		refetch,
	} = usePublications(['news'], getPublishedNews, setLastPage, {
		page: page,
		per_page: 8,
		withAuthors: true,
		orderBy: 'created_at',
		orderDir,
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
				padding: { xs: '15px', sm: '20px' },
			}}
		>
			<Box marginTop={{ xs: '15px', md: '25px' }}>
				<Typography level='h1' fontSize={'clamp(3rem,4vw, 5.5rem)'}>
					Новости
				</Typography>
			</Box>
			<Stack direction={'row'} justifyContent={'flex-end'}>
				<Select
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
				</Select>
			</Stack>
			{!isLoading && news && (
				<Grid container spacing={'50px'} sx={{ marginTop: '30px' }}>
					{news.map(news => (
						<Grid item xs={12} smx={6} mdx={4} lgx={3} xxl={2} key={news.id}>
							<NewsCard data={news} />
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

export default News;
