import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Typography,
} from '@mui/joy';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import React, { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import usePersonalData from '../../../hooks/usePersonalData';

import { logoutFunc } from '../../../utils/authUtils/logout';
import ChangeEmail from '../modals/changeEmail';
import DeleteAccountModal from '../modals/deleteAccount';

import DatePicker from '../../common/datePicker';
import SuccessModal from '../../modals/successModal';

import EditIcon from '@mui/icons-material/Edit';
import Man2Icon from '@mui/icons-material/Man2';
import Woman2Icon from '@mui/icons-material/Woman2';

import { updateUser } from '../../../api/usersApi';
import { getToken } from '../../../utils/authUtils/tokenStorage';
function AccountSection() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: userData, isLoading } = usePersonalData();

	useEffect(() => {
		if (!isLoading && !userData) {
			const handleLogout = async () => {
				await logoutFunc();
				navigate('/login');
				queryClient.removeQueries(['profile']);
				return true;
			};
			handleLogout();
		}
	}, [isLoading, userData, navigate, queryClient]);

	const [firstName, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [patronymic, setPatronymic] = useState('');
	const [city, setCity] = useState('');
	const [gender, setGender] = useState('');
	const [birthday, setBirthday] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
		if (!isLoading && userData) {
			setName(userData.first_name);
			setLastName(userData.last_name);
			setPatronymic(userData.patronymic);
			setCity(userData.city);
			setGender(userData.gender);
			setBirthday(userData.birthday);
			setEmail(userData.email);
		}
	}, [isLoading, userData]);

	const isDataChanged =
		firstName !== userData?.first_name ||
		lastName !== userData?.last_name ||
		patronymic !== userData?.patronymic ||
		city !== userData?.city ||
		gender !== userData?.gender ||
		birthday !== userData?.birthday ||
		email !== userData?.email;

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [changeEmailOpen, setChangeEmailOpen] = useState(false);

	const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	function maskEmail(email) {
		if (email) {
			const [localPart, domain] = email.split('@');
			const visibleChars = 3;
			const maskedLocalPart =
				localPart.slice(0, visibleChars) +
				'*'.repeat(localPart.length - visibleChars);
			return `${maskedLocalPart}@${domain}`;
		} else {
			return;
		}
	}
	const handleUpdateData = async () => {
		const { token, needsRedirect } = await getToken();
		if (needsRedirect) {
			await logoutFunc();
			navigate('/login');
			queryClient.removeQueries(['personalData']);
			return null;
		}
		setIsLoadingUpdate(true);
		const updatedData = {
			first_name: firstName,
			last_name: lastName,
			patronymic: patronymic,
			city: city,
			gender: gender,
			birthday: birthday,
		};
		const response = await updateUser(userData.user_id, token, updatedData);
		if (response) {
			setIsLoadingUpdate(false);
			console.log(response);
			setIsSuccess(true);
			queryClient.removeQueries(['personalData']);
			return true;
		} else {
			setIsLoadingUpdate(false);
			return true;
		}
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

				<ChangeEmail
					id={userData?.id}
					open={changeEmailOpen}
					setOpen={setChangeEmailOpen}
				/>
				<Stack direction={'column'} spacing={3}>
					<Stack direction={'column'} spacing={1.5}>
						<Typography level='title-xl'>Аккаунт</Typography>
						<Typography level='body-md'>
							Сохранение данных аккаунта доступно только после внесения
							изменений.
						</Typography>
					</Stack>
					{!isLoading && userData && (
						<>
							<Stack direction={'column'} spacing={1.5}>
								<FormControl sx={{ maxWidth: '500px' }}>
									<FormLabel>Имя</FormLabel>
									<Input
										type='text'
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
								<Typography level='title-xl'>Почта</Typography>
								<Stack spacing={2} direction={'row'} alignItems={'center'}>
									<Typography>{maskEmail(email)}</Typography>
									<Button
										size='sm'
										onClick={() => {
											setChangeEmailOpen(true);
										}}
									>
										Изменить
									</Button>
								</Stack>
							</Stack>
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