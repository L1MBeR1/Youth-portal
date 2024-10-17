import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { Stack } from '@mui/joy';
import Button from '@mui/joy/Button';
import DialogActions from '@mui/joy/DialogActions';
import DialogContent from '@mui/joy/DialogContent';
import DialogTitle from '@mui/joy/DialogTitle';
import Divider from '@mui/joy/Divider';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';

import { toast } from 'sonner';
import { updateUserPassword } from '../../../api/usersApi';
import { logoutFunc } from '../../../utils/authUtils/logout';
import { getToken } from '../../../utils/authUtils/tokenStorage';
import PasswordField from '../../fields/passwordField';

function ChangePassword({ id, open, setOpen }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [oldPassword, setOldPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [passwordRepeatError, setPasswordRepeatError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [passwordCriteria, setPasswordCriteria] = useState({
		length: false,
		specialChar: false,
		lowercase: false,
		uppercase: false,
	});

	const [PasswordStrength, setPasswordStrength] = useState('');
	function checkPasswordStrength(password) {
		setPasswordStrength(zxcvbn(password));
		// console.log(PasswordStrength.score);
		// console.log(PasswordStrength.feedback.suggestions);
	}
	useEffect(() => {
		setPasswordCriteria({
			length: password.length >= 8,
			specialChar: /[!@#$%^&*-]/.test(password),
			lowercase: /[a-zа-я]/.test(password),
			uppercase: /[A-ZА-Я]/.test(password),
		});
		checkPasswordStrength(password);
	}, [password]);

	const calculateProgress = score => {
		if (score > 0) {
			return (score / 4) * 100;
		} else return 3;
		// return ((score+1) / 5) * 100;
	};
	const getProgressColor = () => {
		const color = ['#f44336', '#ff9800', '#ffc107', '#84ad5b', '#3DAD44'];

		return color[Math.min(PasswordStrength.score, color.length)];
	};
	const getStrengthText = () => {
		switch (PasswordStrength.score) {
			case 0:
				return 'Очень слабый';
			case 1:
				return 'Слабый';
			case 2:
				return 'Средний';
			case 3:
				return 'Сильный';
			case 4:
				return 'Очень сильный';
			default:
				return '';
		}
	};

	useEffect(() => {
		if (
			!(password === passwordRepeat) &&
			!(password.length === 0) &&
			!(passwordRepeat.length === 0)
		) {
			setPasswordRepeatError('Пароли не совпадают');
		} else {
			setPasswordRepeatError('');
		}
	}, [password, passwordRepeat]);

	const handleConfirm = () => {
		if (passwordCriteria) {
			setIsLoading(true);
			updatePassword();
		}
	};

	const handleClose = () => {
		setOpen(false);
		setOldPassword('');
		setPassword('');
		setPasswordRepeat('');
		setPasswordRepeatError('');
	};

	const updatePassword = async () => {
		const { token, needsRedirect } = await getToken();
		if (needsRedirect) {
			await logoutFunc();
			navigate('/login');
			queryClient.removeQueries(['profile']);
			return null;
		}
		const updatedData = {
			password: oldPassword,
			new_password: password,
		};
		const response = await updateUserPassword(id, token, updatedData);
		if (response) {
			await queryClient.refetchQueries(['profile']);
			setIsLoading(false);
			handleClose();
			toast.info(
				'Перейдите по ссылке, отправленной на ваш новый email для подтверждения'
			);
			return;
		} else {
			setIsLoading(false);
		}
		return;
	};

	return (
		<>
			<Modal open={open} onClose={handleClose}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<DialogTitle>
						<Typography level='title-lg'>Изменение пароля</Typography>
					</DialogTitle>
					<Divider />
					<DialogContent>
						<Stack spacing={0}>
							<Stack spacing={0.5}>
								<PasswordField
									label='Введите старый пароль'
									password={oldPassword}
									setPassword={setOldPassword}
								/>
								<PasswordField
									label='Введите новый пароль'
									password={password}
									setPassword={setPassword}
								/>
								<LinearProgress
									determinate
									size='sm'
									value={calculateProgress(PasswordStrength.score)}
									sx={{
										bgcolor: 'background.level3',
										color: getProgressColor(),
									}}
								/>
								<Typography
									level='body-xs'
									sx={{
										alignSelf: 'flex-end',
										color: 'hsl(var(--hue) 80% 30%)',
									}}
								>
									{getStrengthText()}
								</Typography>
							</Stack>
							<Stack>
								<Typography level='body-xs'>
									Пароль должен содержать:
								</Typography>
								<List size='sm' sx={{ '--List-gap': '-5px' }}>
									<ListItem>
										{passwordCriteria.length ? (
											<CheckCircleOutlinedIcon style={{ color: 'green' }} />
										) : (
											<CircleOutlinedIcon />
										)}
										<Typography level='body-xs'>
											длину больше 8 символов
										</Typography>
									</ListItem>
									<ListItem>
										{passwordCriteria.specialChar ? (
											<CheckCircleOutlinedIcon style={{ color: 'green' }} />
										) : (
											<CircleOutlinedIcon />
										)}
										<Typography level='body-xs'>
											специальные символы (например, !, @, #, $, %, ^, &, *, -)
										</Typography>
									</ListItem>
									<ListItem>
										{passwordCriteria.lowercase &&
										passwordCriteria.uppercase ? (
											<CheckCircleOutlinedIcon style={{ color: 'green' }} />
										) : (
											<CircleOutlinedIcon />
										)}
										<Typography level='body-xs'>
											строчную и заглавную букву
										</Typography>
									</ListItem>
								</List>
							</Stack>
						</Stack>
						<PasswordField
							label='Повторите пароль'
							password={passwordRepeat}
							setPassword={setPasswordRepeat}
							error={passwordRepeatError}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							variant='solid'
							onClick={handleConfirm}
							loading={isLoading}
							disabled={
								!passwordCriteria.length ||
								!passwordCriteria.specialChar ||
								!passwordCriteria.lowercase ||
								!passwordCriteria.uppercase ||
								passwordRepeatError
							}
						>
							Подтвердить
						</Button>
						<Button variant='soft' color='neutral' onClick={handleClose}>
							Назад
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</>
	);
}

export default ChangePassword;
