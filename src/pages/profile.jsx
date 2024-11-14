import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPublications } from '../components/profileComponents/userPublications';


import { Modal, ModalClose, ModalDialog, ModalOverflow, DialogContent, DialogTitle} from '@mui/joy';
import ReportResourceForm from '../components/forms/reportResourceForm';

import useUser from '../hooks/useUser';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import CircularProgress from '@mui/joy/CircularProgress';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';

function Profile() {
	const [isReportFormDisplayed, setIsReportFormDisplayed] = useState(false);
	const queryClient = useQueryClient();
	const { id } = useParams();
	// const navigate = useNavigate();
	const { data: userData, isLoading } = useUser(id);
	const [profileData, setProfileData] = useState(null);


	const switchReportFormDisplay = () => {
		setIsReportFormDisplayed(!isReportFormDisplayed);
	};


	useEffect(() => {
		const cachedProfileData = queryClient.getQueryData(['profile']);
		if (cachedProfileData) {
			setProfileData(cachedProfileData);
		}
	}, [queryClient]);
	// console.log(userData);

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
			{isLoading || !userData ? (
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




								<Button
									variant='plain'
									color='neutral'
									size='sm'
									sx={{
										borderRadius: '40px',
										fontSize: 'clamp(0.8rem,3vw, 1rem)',
									}}
									disabled={profileData ? false : true} // TODO: Тут нужна проверка, что посетитель авторизован
									onClick={switchReportFormDisplay}
								>
									{isReportFormDisplayed ? 'Отмена' : "Пожаловаться ( /!\\ )"}
								</Button>
								<Modal open={!!isReportFormDisplayed} onClose={() => setIsReportFormDisplayed(false)}>
									<ModalOverflow>
										<ModalDialog variant={'outlined'}>
											<ModalClose />
											<DialogTitle>Создание жалобы</DialogTitle>
											<DialogContent>
												<ReportResourceForm
													resourceType={'user'}
													resourceId={id}
												/>
											</DialogContent>
										</ModalDialog>
									</ModalOverflow>
								</Modal>




								<Typography level='h2'>{userData.nickname}</Typography>
								<Typography level='title-md'>Какой то статус</Typography>
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
									)}
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
									{userData.roles.map(role => (
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
						<UserPublications id={id} />
					</Box>
				</>
			)}
		</Box>
	);
}

export default Profile;
