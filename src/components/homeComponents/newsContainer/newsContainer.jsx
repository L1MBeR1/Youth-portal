import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Grid, Stack } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublishedNews } from '../../../api/newsApi';
import usePublications from '../../../hooks/usePublications';
import NewsCard from './newsCard';

const NewsContainer = () => {
	const navigate = useNavigate();
	const [lastPage, setLastPage] = useState(1);
	const { data: news, isLoading } = usePublications(
		['homeNews'],
		getPublishedNews,
		setLastPage,
		{
			page: 1,
			per_page: 4,
			withAuthors: false,
			orderBy: 'created_at',
			orderDir: 'desc',
		}
	);

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
						Новости
						<NavigateNextIcon
							sx={{
								transition: 'color 0.2s',
							}}
						/>
					</Stack>
				</Typography>
			</Stack>
			{!isLoading && news && (
				<Grid
					container
					spacing={2}
					sx={{
						minHeight: '45vh',
					}}
				>
					{news.length > 0 && (
						<Grid item xs={12} md={6} mdx={4}>
							<NewsCard data={news[0]} isExpended={true} />
						</Grid>
					)}

					{news.length > 1 && (
						<Grid item xs={12} md={6} mdx={4}>
							<NewsCard data={news[1]} isExpended={true} />
						</Grid>
					)}

					<Grid item xs={12} md={12} mdx={4} sx={{ display: 'flex' }}>
						<Stack
							spacing={2}
							flexGrow={1}
							sx={{
								flexDirection: { xs: 'column', md: 'row', mdx: 'column' },
							}}
						>
							{news.slice(2).map(item => (
								<NewsCard key={item.id} data={item} isExpended={false} />
							))}
						</Stack>
					</Grid>
				</Grid>
			)}
		</Stack>
	);
};

export default NewsContainer;
