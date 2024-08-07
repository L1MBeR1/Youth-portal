import React, { useState } from 'react';

import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Stack from '@mui/joy/Stack';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import Tabs from '@mui/joy/Tabs';
import Typography from '@mui/joy/Typography';
import useUserPublications from '../../hooks/useUserPublications.js';

import NewspaperIcon from '@mui/icons-material/Newspaper';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import ProfileBlogCard from './profileBlogCard.jsx';
import ProfilePodcastsCard from './profilePodcastsCard.jsx';
export const UserPublications = ({ id }) => {
	const [tab, setTab] = useState(0);
	const [podcasts, blogs, news] = useUserPublications(id);

	return (
		<Stack spacing={3}>
			<Box>
				<Typography level='title-lg'>Публикации</Typography>
			</Box>
			<Tabs
				size='lg'
				value={tab}
				onChange={(e, value) => setTab(value)}
				sx={{
					// borderRadius: 16,
					// maxWidth: 500,
					[`& .${tabClasses.root}`]: {
						py: 1,
						flex: 1,
						transition: '0.3s',
						fontWeight: 'md',
						fontSize: 'md',
						[`&:not(.${tabClasses.selected}):not(:hover)`]: {
							opacity: 0.7,
						},
					},
				}}
			>
				<TabList
					variant='plain'
					size='sm'
					disableUnderline
					sx={{
						borderRadius: '50px',
						p: 0,
					}}
				>
					<Tab
						// {...(tab === 0 && { color: 'net' })}
						disableIndicator
					>
						<ListItemDecorator>
							<NewspaperIcon />
						</ListItemDecorator>
						Блоги
					</Tab>
					<Tab disableIndicator>
						<ListItemDecorator>
							<PodcastsIcon />
						</ListItemDecorator>
						Подкасты
					</Tab>
					<Tab disableIndicator>
						<ListItemDecorator>
							<TextSnippetIcon />
						</ListItemDecorator>
						Новости
					</Tab>
				</TabList>
			</Tabs>
			<Stack
				justifyContent={'center'}
				alignItems={'center'}
				flexGrow={1}
				sx={{
					width: '100%',
				}}
			>
				{tab === 0 &&
					(blogs.data ? (
						<Grid container spacing={6} sx={{ flexGrow: 1 }}>
							{blogs.data.map(blog => (
								<Grid key={blog.id} xs={12} sm={6} md={6} lg={4}>
									<ProfileBlogCard
										id={blog.id}
										title={blog.title}
										img={blog.cover_uri}
										createDate={blog.created_at}
									/>
								</Grid>
							))}
						</Grid>
					) : (
						<Typography level='body-sm'>Нет блогов</Typography>
					))}
				{tab === 1 &&
					(podcasts.data ? (
						<Grid container spacing={6} sx={{ flexGrow: 1 }}>
							{podcasts.data.map(blog => (
								<Grid key={blog.id} xs={6} sm={4} md={3} lg={3}>
									<ProfilePodcastsCard
										id={blog.id}
										title={blog.title}
										img={blog.cover_uri}
										createDate={blog.created_at}
									/>
								</Grid>
							))}
						</Grid>
					) : (
						<Typography level='body-sm'>Нет блогов</Typography>
					))}
				{tab === 2 &&
					(news.data ? (
						<Grid container spacing={6} sx={{ flexGrow: 1 }}>
							{news.data.map(blog => (
								<Grid key={blog.id} xs={12} sm={6} md={6} lg={4}>
									<ProfileBlogCard
										id={blog.id}
										title={blog.title}
										img={blog.cover_uri}
										createDate={blog.created_at}
									/>
								</Grid>
							))}
						</Grid>
					) : (
						<Typography level='body-sm'>Нет новостей</Typography>
					))}
			</Stack>
		</Stack>
	);
};