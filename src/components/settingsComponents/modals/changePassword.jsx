import React, { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import InfoIcon from '@mui/icons-material/Info';
import { Stack } from '@mui/joy';
import FormControl from '@mui/joy/FormControl';
import LinearProgress from '@mui/joy/LinearProgress';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import NeutralModal from '../../modals/neutralModal';

import { logoutFunc } from '../../../utils/authUtils/logout';
import { getToken } from '../../../utils/authUtils/tokenStorage';
import { updateUserPassword } from '../../../api/usersApi';
import PasswordField from '../../forms/formComponents/passwordField';

function ChangePassword({ id, open, setOpen }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [password, setPassword] = useState('');

	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [passwordRepeatError, setPasswordRepeatError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const [passwordCriteria, setPasswordCriteria] = useState({
		length: false,
		specialChar: false,
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
			password,
		};
		const response = await updateUserPassword(id, token, updatedData);
		if (response) {
			queryClient.removeQueries(['profile']);
			setIsLoading(false);
			setOpen(false);
			console.log(response);
			setIsSuccess(true);
			queryClient.removeQueries(['profile']);
			return;
		}
		return;
	};

	return (
		<>
			<NeutralModal
				open={isSuccess}
				setOpen={setIsSuccess}
				message={'Пароль успешно обновлён.'}
				position={{ vertical: 'bottom', horizontal: 'right' }}
				icon={<InfoIcon />}
			/>
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
									lable='Введите новый пароль'
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
								</List>
							</Stack>
						</Stack>
						<PasswordField
							lable='Повторите пароль'
							password={passwordRepeat}
							setPassword={setPasswordRepeat}
							error={passwordRepeatError}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							variant='solid'
							onClick={handleConfirm}
							disabled={
								!passwordCriteria.length ||
								!passwordCriteria.specialChar ||
								isLoading ||
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
