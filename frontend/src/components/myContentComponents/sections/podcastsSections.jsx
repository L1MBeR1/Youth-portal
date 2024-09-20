import AddIcon from '@mui/icons-material/Add';
import SortIcon from '@mui/icons-material/Sort';
import { Box, Button, Grid, Option, Select, Stack, Typography } from '@mui/joy';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBlogs } from '../../../api/blogsApi';
import useMyPublications from '../../../hooks/useMyPublications';
import { logoutFunc } from '../../../utils/authUtils/logout';
import ProfileBlogCard from '../../profileComponents/profileBlogCard';

import Pagination from '../../workspaceComponents/shared/workSpacePagination';

function PodcastsSections() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [orderDir, setOrderDir] = useState('desc');
	const [status, setStatus] = useState(null);

	const [isNeedRefetch, setIsNeedRefetch] = useState(false);

	const {
		data: blogs,
		isLoading,
		refetch,
	} = useMyPublications(['MyBlogs'], getMyBlogs, setLastPage, {
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
		if (!isLoading && !blogs) {
			const handleLogout = async () => {
				await logoutFunc();
				navigate('/login');
				queryClient.removeQueries(['profile']);
				return true;
			};
			handleLogout();
		}
	}, [isLoading, blogs, navigate, queryClient]);

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
		setStatus(newValue);
		setIsNeedRefetch(true);
	};
	return (
		<>
			<Box>
				<Stack direction={'column'} spacing={3}>
					<Stack direction={'column'} spacing={2}>
						<Stack direction={'row'} justifyContent={'space-between'}>
							<Typography level='title-xl'>Мои блоги</Typography>
							<Button
								size={'sm'}
								endDecorator={<AddIcon />}
								onClick={() => {
									navigate('/blog_creator');
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
								variant='plain'
								placeholder='Выберете статус'
								endDecorator={<SortIcon />}
								indicator={null}
								color='neutral'
								onChange={(e, newValue) => handleStatusChange(newValue)}
							>
								<Option value={'published'}>Опубликованные</Option>
								<Option value={'moderating'}>На проверке</Option>
								<Option value={'archived'}>Архивированные</Option>
								<Option value={'pending'}>На доработке</Option>
							</Select>
						</Stack>
						{!isLoading && blogs && (
							<Box sx={{ marginX: '-25px' }}>
								<Grid container spacing={'40px'}>
									{blogs.map(blog => (
										<Grid xs={12} sm={6} md={12} lgx={6} xxl={4} key={blog.id}>
											<ProfileBlogCard data={blog} status={blog.status} />
										</Grid>
									))}
								</Grid>
							</Box>
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

export default PodcastsSections;
