import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import { Button, Stack, Typography } from '@mui/joy';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import React, { useEffect, useState } from 'react';
import { getPublishedNews } from '../api/newsApi.js';
import NewsFilterDrawer from '../components/drawers/newsFilterDrawer.jsx';
import SearchField from '../components/fields/searchField.jsx';
import NewsCard from '../components/publicationsComponents/newsCard.jsx';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
import usePublications from '../hooks/usePublications';
function News() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [orderDir, setOrderDir] = useState('desc');

	const [isNeedRefetch, setIsNeedRefetch] = useState(false);
	const [tag, setTag] = useState('');
	const [drawerOpen, setDrawerOpen] = useState(false);
	const searchFields = ['title'];
	const [searchValue, setSearchValue] = useState('');
	const [searchValues, setSearchValues] = useState([]);

	const {
		data: news,
		isLoading,
		refetch,
	} = usePublications(['news'], getPublishedNews, setLastPage, {
		page: page,
		per_page: 8,
		searchFields: searchFields,
		searchValues: searchValues,
		withAuthors: true,
		orderBy: 'created_at',
		orderDir,
	});
	useEffect(() => {
		refetch();
	}, [page, refetch]);

	useEffect(() => {
		if (isNeedRefetch) {
			refetch();
			setIsNeedRefetch(false);
		}
	}, [isNeedRefetch, refetch]);
	const clearSearchValue = () => {
		setSearchValue('');
		setSearchValues([]);
		setIsNeedRefetch(true);
	};
	const applySearchValue = () => {
		setSearchValues([searchValue]);
		setIsNeedRefetch(true);
	};
	const handleSortChange = newValue => {
		setOrderDir(newValue);
		setIsNeedRefetch(true);
	};

	const clearFilters = () => {
		setTag('');
		setIsNeedRefetch(true);
	};
	return (
		<Stack
			direction={'column'}
			sx={{
				gap: '30px',
				padding: { xs: '15px', sm: '40px' },
			}}
		>
			<Box marginTop={{ xs: '15px', md: '25px' }}>
				<Typography level='h1' fontSize={'clamp(3rem,4vw, 5.5rem)'}>
					Новости
				</Typography>
			</Box>
			<NewsFilterDrawer
				open={drawerOpen}
				setOpen={setDrawerOpen}
				tag={tag}
				setTag={setTag}
				clearFilters={clearFilters}
				refetch={refetch}
			/>
			<Stack
				justifyContent={'space-between'}
				sx={{
					flexDirection: { xs: 'column', md: 'row' },
				}}
				gap={3}
			>
				<Stack direction={'row'} spacing={2}>
					<SearchField
						size='sm'
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						onClear={clearSearchValue}
						sx={{ borderRadius: '30px', width: '100%' }}
					/>

					<Button
						color='primary'
						onClick={() => {
							applySearchValue();
						}}
					>
						Найти
					</Button>
				</Stack>
				<Stack
					direction={'row'}
					spacing={2}
					sx={{
						justifyContent: { xs: 'space-between', md: '' },
					}}
				>
					<Button onClick={() => setDrawerOpen(true)}>
						<FilterAltIcon />
					</Button>
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
			</Stack>
			{!isLoading && news && (
				<Grid container spacing={'50px'}>
					{news.map(news => (
						<Grid xs={12} smx={6} mdx={4} lgx={3} xxl={2} key={news.id}>
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
