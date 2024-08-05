import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfile from '../hooks/useProfile';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import CircularProgress from '@mui/joy/CircularProgress';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Stack from '@mui/joy/Stack';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import Tabs from '@mui/joy/Tabs';
import Typography from '@mui/joy/Typography';

import NewspaperIcon from '@mui/icons-material/Newspaper';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

function Profile() {
	const navigate = useNavigate();
	const { data: profileData, isLoading } = useProfile();
	if (!profileData) {
		navigate('/login');
	}

	const [tab, setTab] = useState(0);
	console.log(profileData);

	return (
		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				marginX: { xs: '10px', md: '10%', lg: '15%' },
				// border: '1px solid',
				// borderColor: 'divider',
			}}
		>
			{isLoading || !profileData ? (
				<CircularProgress size='lg' />
			) : (
				<>
					<Box
						sx={{
							backgroundColor: 'gray',
							width: '100%',
							height: { xs: '100px', lg: '150px' },
						}}
					/>
					<Box
						sx={{
							position: 'absolute',
							zIndex: '10',
							top: { xs: '100px', lg: '150px' },
							left: { xs: '20px', md: '30px', lg: '40px' },
							transform: 'translateY(-50%)',
						}}
					>
						<Avatar
							src={profileData?.profile_image_uri || ''}
							sx={{
								boxSizing: 'content-box',
								border: '5px solid white',
								'--Avatar-size': {
									xs: '80px',
									sm: '90px',
									md: '110px',
									lg: '120px',
								},
							}}
						/>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
							height: '500px',
							paddingX: { xs: '20px', md: '30px', lg: '40px' },
							gap: '20px',
						}}
					>
						<Stack direction='row' justifyContent='space-between'>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									paddingTop: {
										xs: '45px',
										sm: '50px',
										md: '60px',
										lg: '65px',
									},
									gap: '5px',
								}}
							>
								<Typography level='h2'>{profileData.nickname}</Typography>
								<Typography level='title-md'>Какой то статус</Typography>
								<Stack direction='row' spacing={0.5} alignItems='center'>
									<PersonIcon sx={{ fontSize: 18 }} />
									<Typography level='body-md'>
										{profileData.last_name +
											' ' +
											profileData.first_name +
											' ' +
											profileData.patronymic}
									</Typography>
								</Stack>
								<Stack direction='row' spacing={0.5} alignItems='center'>
									<PlaceIcon sx={{ fontSize: 18 }} />
									<Typography level='body-md'>{profileData.city}</Typography>
								</Stack>
								<Stack margin={'5px 0 0 0'} direction='row' spacing={2}>
									<Button
										sx={{ borderRadius: '40px' }}
										variant='soft'
										size='lg'
									>
										Редактировать
									</Button>
									<Button
										sx={{ borderRadius: '40px' }}
										variant='plain'
										size='lg'
									>
										Настройки
									</Button>
								</Stack>
							</Box>
							<Stack
								spacing={4}
								alignItems='flex-end'
								direction='column'
								// justifyContent="space-between"
								sx={{
									paddingTop: '20px',
								}}
							>
								<Stack>
									{profileData.roles.map(role => (
										<Chip key={role} size='lg'>
											{role}
										</Chip>
									))}
								</Stack>
								<Stack
									direction='row'
									justifyContent='center'
									alignItems='center'
									spacing={3}
									sx={{
										display: { xs: 'none', md: 'flex' },
									}}
								>
									<Stack direction='column' alignItems='center'>
										<Typography level='title-sm'>Публикаций</Typography>
										<Typography level='body-md'>0</Typography>
									</Stack>
									<Stack direction='column' alignItems='center'>
										<Typography level='title-sm'>Лайков</Typography>
										<Typography level='body-md'>0</Typography>
									</Stack>
									<Stack direction='column' alignItems='center'>
										<Typography level='title-sm'>Просмотров</Typography>
										<Typography level='body-md'>0</Typography>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
						<Stack spacing={1}>
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
							<Box
								sx={{
									display: 'flex',
									width: '100%',
									height: '100px',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Typography level='body-sm'>Нет публикаций</Typography>
							</Box>
						</Stack>
					</Box>
				</>
			)}
		</Box>
	);
}

export default Profile;
