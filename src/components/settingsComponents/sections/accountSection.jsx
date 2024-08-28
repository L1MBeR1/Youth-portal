import React, { useEffect, useState } from 'react';
import {
	Avatar,
	Box,
	Stack,
	Typography,
	Badge,
	Button,
	IconButton,
	FormControl,
	FormLabel,
	Input,
	FormHelperText,
	Divider,
} from '@mui/joy';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import useProfile from '../../../hooks/useProfile';
import useUser from '../../../hooks/useUser';
import { logoutFunc } from '../../../utils/authUtils/logout';
import DeleteAccountModal from '../modals/deleteAccount';

import DatePicker from '../../common/datePicker';
import SuccessModal from '../../modals/successModal';

import Woman2Icon from '@mui/icons-material/Woman2';
import Man2Icon from '@mui/icons-material/Man2';
import EditIcon from '@mui/icons-material/Edit';

import { getToken } from '../../../utils/authUtils/tokenStorage';
import { updateUser } from '../../../api/usersApi';
function AccountSection() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: profileData, isLoading: isProfileLoading } = useProfile();
	const { data: userData, isLoading: isUserLoading } = useUser(
		profileData?.user_id
	);

	useEffect(() => {
		if (!isProfileLoading && !profileData) {
			const handleLogout = async () => {
				await logoutFunc();
				navigate('/login');
				queryClient.removeQueries(['profile']);
				return true;
			};
			handleLogout();
		}
	}, [isProfileLoading, profileData, navigate, queryClient]);

	const [firstName, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [patronymic, setPatronymic] = useState('');
	const [city, setCity] = useState('');
	const [gender, setGender] = useState('');
	const [birthday, setBirthday] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
		if (!isUserLoading && userData) {
			setName(userData.first_name);
			setLastName(userData.last_name);
			setPatronymic(userData.patronymic);
			setCity(userData.city);
			setGender(userData.gender);
			setBirthday(userData.birthday);
			setEmail(userData.email);
		}
	}, [isUserLoading, userData]);

	const isDataChanged =
		firstName !== userData?.first_name ||
		lastName !== userData?.last_name ||
		patronymic !== userData?.patronymic ||
		city !== userData?.city ||
		gender !== userData?.gender ||
		birthday !== userData?.birthday ||
		email !== userData?.email;

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleUpdateData = async () => {
		const { token, needsRedirect } = await getToken('BloggerSection');
		if (needsRedirect) {
			await logoutFunc();
			navigate('/login');
			queryClient.removeQueries(['profile']);
			return null;
		}
		setIsLoadingUpdate(true);
		const updatedData = {
			last_name: lastName,
		};
		const response = await updateUser(profileData.user_id, token, updatedData);
		if (response) {
			setIsLoadingUpdate(false);
			console.log(response);
			setIsSuccess(true);
			queryClient.removeQueries(['profile']);
		} else {
			setIsLoadingUpdate(false);
		}
		return true;
	};
	return (
		<>
			<SuccessModal
				open={isSuccess}
				setOpen={setIsSuccess}
				message={'Данные успешно обновлены'}
				position={{ vertical: 'bottom', horizontal: 'right' }}
				icon={<EditIcon />}
			/>
			<Box>
				<DeleteAccountModal
					id={userData?.id}
					unique={userData?.email}
					open={deleteModalOpen}
					setOpen={setDeleteModalOpen}
				/>
				<Stack direction={'column'} spacing={3}>
					<Stack direction={'column'} spacing={1.5}>
						<Typography level='title-xl'>Аккаунт</Typography>
						<Typography level='body-md'>
							Сохранение данных аккаунта доступно только после внесения
							изменений.
						</Typography>
					</Stack>
					{!isUserLoading && profileData && (
						<>
							<Stack direction={'column'} spacing={1.5}>
								<FormControl sx={{ maxWidth: '500px' }}>
									<FormLabel>Имя</FormLabel>
									<Input
										placeholder='Введите имя'
										value={firstName}
										onChange={e => setName(e.target.value)}
									/>
								</FormControl>
								<FormControl sx={{ maxWidth: '500px' }}>
									<FormLabel>Фамилия</FormLabel>
									<Input
										placeholder='Введите фамилию'
										value={lastName}
										onChange={e => setLastName(e.target.value)}
									/>
								</FormControl>
								<FormControl sx={{ maxWidth: '500px' }}>
									<FormLabel>Отчество</FormLabel>
									<Input
										placeholder='Введите отчество'
										value={patronymic}
										onChange={e => setPatronymic(e.target.value)}
									/>
								</FormControl>
								<FormControl sx={{ maxWidth: '500px' }}>
									<FormLabel>Город</FormLabel>
									<Input
										placeholder='Введите город'
										value={city}
										onChange={e => setCity(e.target.value)}
									/>
								</FormControl>
								<DatePicker
									sx={{ maxWidth: '500px' }}
									label={'Дата рождения'}
									placeholder={'Выберите дату рождения'}
									value={birthday}
									onChange={newValue => setBirthday(newValue)}
								/>
								<FormControl>
									<FormLabel>Пол</FormLabel>
									<RadioGroup
										value={gender}
										onChange={e => setGender(e.target.value)}
										overlay
										sx={{
											flexDirection: 'row',
											gap: 2,
											[`& .${radioClasses.checked}`]: {
												[`& .${radioClasses.action}`]: {
													inset: -1,
													border: '2px solid',
													borderColor: 'primary.500',
												},
											},
											[`& .${radioClasses.radio}`]: {
												display: 'contents',
												'& > svg': {
													zIndex: 2,
													position: 'absolute',
													top: '-8px',
													right: '-8px',

													borderRadius: '50%',
												},
											},
										}}
									>
										<Sheet
											variant='outlined'
											sx={{
												borderRadius: '30px',
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												p: 1,
												paddingRight: '15px',
												background: 'var(--joy-palette-main-background)',
											}}
										>
											<Radio
												value={'m'}
												checkedIcon={<CheckCircleRoundedIcon />}
											/>
											<Man2Icon sx={{ marginRight: '5px' }} />
											<Typography level='title-sm'>Мужской</Typography>
										</Sheet>
										<Sheet
											variant='outlined'
											sx={{
												borderRadius: '30px',
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyItems: 'center',
												p: 1,
												paddingRight: '15px',
												background: 'var(--joy-palette-main-background)',
											}}
										>
											<Radio
												value={'f'}
												checkedIcon={<CheckCircleRoundedIcon />}
											/>
											<Woman2Icon sx={{ marginRight: '5px' }} />
											<Typography level='title-sm'>Женский</Typography>
										</Sheet>
									</RadioGroup>
								</FormControl>
								<FormControl sx={{ maxWidth: '500px' }}>
									<FormLabel>Почта</FormLabel>
									<Input
										type='email'
										placeholder='Введите почту'
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
								</FormControl>
							</Stack>
							{isDataChanged && (
								<Stack direction={'row'} spacing={4}>
									<Box>
										<Button
											loading={isLoadingUpdate}
											onClick={() => {
												handleUpdateData();
											}}
										>
											Сохранить изменения
										</Button>
									</Box>
									<Box>
										<Button
											variant='soft'
											onClick={() => {
												setName(userData.first_name);
												setLastName(userData.last_name);
												setPatronymic(userData.patronymic);
												setCity(userData.city);
												setGender(userData.gender);
												setBirthday(userData.birthday);
												setEmail(userData.email);
											}}
										>
											Отменить
										</Button>
									</Box>
								</Stack>
							)}
							<Divider />
							<Stack direction={'column'} spacing={1.5}>
								<Typography level='title-xl' color='danger'>
									Удалить аккаунт
								</Typography>
								<Stack spacing={1.5}>
									<Typography level='body-md'>
										Удаление аккаунта — это необратимое действие. Все ваши
										данные будут удалены навсегда.
									</Typography>
									<Box>
										<Button
											color='danger'
											onClick={() => {
												setDeleteModalOpen(true);
											}}
										>
											Удалить мой аккаунт
										</Button>
									</Box>
								</Stack>
							</Stack>
						</>
					)}
				</Stack>
			</Box>
		</>
	);
}

export default AccountSection;
