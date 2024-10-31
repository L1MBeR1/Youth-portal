import { CloseRounded } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import SortIcon from '@mui/icons-material/Sort';
import {
	Box,
	Button,
	CircularProgress,
	Grid,
	IconButton,
	Option,
	Select,
	Stack,
	Typography,
} from '@mui/joy';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyNews } from '../../api/newsApi';
import ProfileBlogCard from '../../components/profileComponents/profileBlogCard';
import Pagination from '../../components/workspaceComponents/shared/workSpacePagination';
import useMyPublications from '../../hooks/useMyPublications';

function NewsSection() {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [orderDir, setOrderDir] = useState('desc');
	const action = useRef(null);
	const [status, setStatus] = useState('');

	const [isNeedRefetch, setIsNeedRefetch] = useState(false);

	const {
		data: news,
		isFetching,
		refetch,
	} = useMyPublications(['MyNews'], getMyNews, setLastPage, {
		page: page,
		per_page: 8,
		withAuthors: true,
		orderBy: 'created_at',
		orderDir,
		status,
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

	const handleSortChange = newValue => {
		setOrderDir(newValue);
		setIsNeedRefetch(true);
	};

	const handleStatusChange = newValue => {
		setStatus(newValue || '');
		setIsNeedRefetch(true);
	};
	return (
		<>
			<Box>
				<Stack direction={'column'} spacing={3}>
					<Stack direction={'column'} spacing={2}>
						<Stack direction={'row'} justifyContent={'space-between'}>
							<Typography level='title-xl'>Мои новости</Typography>
							<Button
								size={'sm'}
								endDecorator={<AddIcon />}
								onClick={() => {
									navigate('/my-content/news/create');
								}}
							>
								Создать
							</Button>
						</Stack>
						<Stack direction={'row'}>
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
							<Select
								action={action}
								variant='plain'
								placeholder='Выберете статус'
								color='neutral'
								value={status}
								onChange={(e, newValue) => handleStatusChange(newValue)}
								{...(status && {
									endDecorator: (
										<IconButton
											size='sm'
											variant='plain'
											color='neutral'
											onMouseDown={event => {
												event.stopPropagation();
											}}
											onClick={() => {
												handleStatusChange('');
												action.current?.focusVisible();
											}}
										>
											<CloseRounded />
										</IconButton>
									),
									indicator: null,
								})}
							>
								<Option value={'published'}>Опубликованные</Option>
								<Option value={'moderating'}>На проверке</Option>
								<Option value={'archived'}>Архивированные</Option>
								<Option value={'pending'}>На доработке</Option>
							</Select>
						</Stack>
						{isFetching ? (
							<Stack
								justifyContent={'center'}
								alignItems={'center'}
								sx={{ height: '20vh' }}
							>
								<CircularProgress size='md' />
							</Stack>
						) : news && news.length > 0 ? (
							<Box sx={{ marginX: '-25px' }}>
								<Grid container spacing={'40px'}>
									{news.map(item => (
										<Grid xs={12} sm={6} md={12} lgx={6} xxl={4} key={item.id}>
											<ProfileBlogCard data={item} status={item.status} />
										</Grid>
									))}
								</Grid>
							</Box>
						) : (
							<Typography>Новостей по такому запросу нет</Typography>
						)}
						<Pagination
							page={page}
							lastPage={lastPage}
							onPageChange={setPage}
						/>
					</Stack>
				</Stack>
			</Box>
		</>
	);
}

export default NewsSection;
