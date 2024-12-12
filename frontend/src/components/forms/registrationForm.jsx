import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi.js';
import { setToken } from '../../utils/authUtils/tokenStorage.js';

import { useQueryClient } from '@tanstack/react-query';
import zxcvbn from 'zxcvbn';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

import { jwtDecode } from 'jwt-decode';

import { Divider } from '@mui/joy';
import { VkAuthButton } from '../buttons/auth/vkAuthButton.jsx';
import EmailField from '../fields/emailField.jsx';
import PasswordField from '../fields/passwordField.jsx';

function RegistrationForm() {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [emailStatus, setEmailStatus] = useState('');
	const [emailError, setEmailError] = useState('');

	const [password, setPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [passwordRepeatError, setPasswordRepeatError] = useState('');

	const [passwordCriteria, setPasswordCriteria] = useState({
		length: false,
		specialChar: false,
		lowercase: false,
		uppercase: false,
	});

	const navigate = useNavigate();

	const [PasswordStrength, setPasswordStrength] = useState('');
	function checkPasswordStrength(password) {
		setPasswordStrength(zxcvbn(password));
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

	const handleSubmit = async e => {
		e.preventDefault();
		setIsLoading(true);
		const { length, specialChar, lowercase, uppercase } = passwordCriteria;
		if (!length || !specialChar || !lowercase || !uppercase) {
			setError('Пароль не соответствует требованиям');
			setIsLoading(false);
			return;
		}

		if (password !== passwordRepeat) {
			setError('Пароли не совпадают');
			setIsLoading(false);
			return;
		}

		try {
			const data = await register(email, password);
			const token = data.access_token;

			if (token) {
				setToken(token);
				const decoded = jwtDecode(token);
				await queryClient.refetchQueries(['profile']);
				if (decoded.roles.includes('admin')) {
					navigate('/admin');
				} else if (decoded.roles.includes('moderator')) {
					navigate('/moderator');
				} else {
					navigate('/');
				}
			}
			setIsLoading(false);
		} catch (error) {
			setError('Ошибка авторизации. Пожалуйста, проверьте свои данные.');
			console.error('Registration failed', error);
			setIsLoading(false);
		}
	};

	return (
		<Card
			variant='plain'
			sx={{
				borderRadius: '30px',
				width: '100%',
				maxWidth: '450px',
				padding: '25px',
				marginTop: '40px',
			}}
		>
			<form onSubmit={handleSubmit}>
				<Stack spacing={2.5}>
					<Stack spacing={1}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Typography level='h4'>Регистрация</Typography>
						</Box>
						<Typography level='body-xs' sx={{ color: 'red' }}>
							{error}
						</Typography>
						<EmailField
							email={email}
							setEmail={setEmail}
							setEmailStatus={setEmailStatus}
							setEmailError={setEmailError}
						/>
						<Stack spacing={0}>
							<Stack spacing={0.5}>
								<PasswordField
									label='Пароль'
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
											специальный символ (например, !, @, #, $, %, ^, &, *, -)
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
						<Button loading={Boolean(isLoading)} type='submit'>
							Зарегистрироваться
						</Button>
					</Stack>
					<Divider />
					<VkAuthButton
						label={'Продолжить через Вконтакте'}
						variant={'soft'}
						navigate={navigate}
						setErrorMessage={setError}
						setIsLoading={setIsLoading}
					/>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'row',
							paddingTop: '5px',
							gap: '5px',
						}}
					>
						<Typography level='body-sm'>Уже есть аккаунт?</Typography>
						<Link to='/login'>
							<Typography level='body-sm'>Войти в аккаунт</Typography>
						</Link>
					</Box>
				</Stack>
			</form>
		</Card>
	);
}

export default RegistrationForm;
