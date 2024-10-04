import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import { Button, Option, Select, Stack, Typography } from '@mui/joy';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import React, { useEffect, useState } from 'react';
import { getPublishedPodcasts } from '../api/podcastsApi.js';
import SearchField from '../components/fields/searchField.jsx';
import PodcastsCard from '../components/publicationsComponents/podcastsCard.jsx';
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
import usePublications from '../hooks/usePublications';
function Podcasts() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);

	const [orderDir, setOrderDir] = useState('desc');
	const [isNeedRefetch, setIsNeedRefetch] = useState(false);
	const searchFields = ['title'];
	const [searchValue, setSearchValue] = useState('');
	const [searchValues, setSearchValues] = useState([]);
	const {
		data: podcasts,
		isLoading,
		refetch,
	} = usePublications(['podcasts'], getPublishedPodcasts, setLastPage, {
		page: page,
		per_page: 12,
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
					Подкасты
				</Typography>
			</Box>
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
					<Button>
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
			{!isLoading && podcasts && (
				<Grid container spacing={'50px'}>
					{podcasts.map(podcast => (
						<Grid xs={12} sm={6} md={4} lg={3} lgx={2} xxl={2} key={podcast.id}>
							<PodcastsCard data={podcast} />
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
