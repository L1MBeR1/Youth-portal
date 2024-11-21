import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPublications } from '../components/profileComponents/userPublications';

import { Card, CardOverflow, IconButton } from '@mui/joy';

import useUser from '../hooks/useUser';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import CircularProgress from '@mui/joy/CircularProgress';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import FlagIcon from '@mui/icons-material/Flag';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import ReportResourceModal from '../components/modals/reportResourceModal.jsx';
import useProfile from '../hooks/useProfile.js';
import { mainMargin } from '../themes/margins.js';
import { getBackgroundColor } from '../utils/colors/getBackgroundColor.js';
function Profile() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data: userData, isLoading } = useUser(id);
	const { data: profileData } = useProfile();
	const [reportModalOpen, setReportModalOpen] = useState(false);

	const [pastelColor, setPastelColor] = useState('#bebebe');

	useEffect(() => {
		async function fetchPastelColor() {
			const color = await getBackgroundColor(userData.profile_image_uri);
			setPastelColor(color);
		}
		if (userData) {
			fetchPastelColor();
		}
	}, [userData]);

	return (
		<>
			<ReportResourceModal
				id={id}
				resourceType={'user'}
				setOpen={setReportModalOpen}
				open={reportModalOpen}
			/>
			<Box
				sx={{
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
					marginX: mainMargin,
				}}
			>
				{isLoading || !userData ? (
					<Stack
						justifyContent={'center'}
						alignItems={'center'}
						sx={{ height: '40vh' }}
					>
						<CircularProgress size='md' />
					</Stack>
				) : (
					<Card
						variant='plain'
						sx={{
							marginTop: '20px',
							'--Card-radius': '20px',
							p: '25px',
							overflow: 'hidden',
						}}
					>
						<CardOverflow
							sx={{
								p: 0,
							}}
						>
							<Box
								sx={{
									backgroundColor: pastelColor,
									width: '100%',
									height: { xs: '100px', lg: '150px' },
								}}
							/>
						</CardOverflow>
						<Box
							sx={{
								position: 'absolute',
								zIndex: '10',
								top: { xs: '100px', lg: '150px' },
								left: { xs: '25px' },
								transform: 'translateY(-50%)',
							}}
						>
							<Avatar
								src={userData?.profile_image_uri || ''}
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
								gap: '20px',
							}}
						>
							<Stack direction='row' justifyContent='space-between'>
								<Stack
									direction={'column'}
									gap={1.5}
									sx={{
										paddingTop: {
											xs: '45px',
											sm: '50px',
											md: '60px',
											lg: '65px',
										},
									}}
								>
									<Typography level='h3'>{userData.nickname}</Typography>
									<Stack direction='row' spacing={0.5} alignItems='center'>
										<PersonIcon sx={{ fontSize: 18 }} />
										<Typography level='body-md'>
											{userData.last_name +
												' ' +
												userData.first_name +
												' ' +
												userData.patronymic}
										</Typography>
									</Stack>
									<Stack direction='row' spacing={0.5} alignItems='center'>
										<PlaceIcon sx={{ fontSize: 18 }} />
										<Typography level='body-md'>{userData.city}</Typography>
									</Stack>
									{profileData &&
										userData &&
										profileData.user_id === userData.user_id && (
											<Stack margin={'5px 0 0 0'} direction='row' spacing={2}>
												<Button
													sx={{ borderRadius: '40px' }}
													variant='soft'
													size='md'
													onClick={() => {
														navigate(`/settings/public`);
													}}
												>
													Редактировать
												</Button>
											</Stack>
										)}
								</Stack>
								<Stack
									spacing={4}
									alignItems='flex-end'
									direction='column'
									sx={{
										paddingTop: '20px',
									}}
								>
									<IconButton
										variant='soft'
										color='danger'
										size='md'
										disabled={!profileData}
										onClick={() => {
											setReportModalOpen(true);
										}}
									>
										<FlagIcon />
									</IconButton>
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
							<UserPublications id={id} />
						</Box>
					</Card>
				)}
			</Box>
		</>
	);
}

export default Profile;
