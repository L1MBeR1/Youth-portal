import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi.js';
import { setToken } from '../../utils/authUtils/tokenStorage.js';
import PasswordField from '../fields/passwordField.jsx';

import { CircularProgress, Divider } from '@mui/joy';
import { jwtDecode } from 'jwt-decode';
import { VkAuthButton } from '../buttons/auth/vkAuthButton.jsx';

function LoginForm() {
	const queryClient = useQueryClient();
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	// const queryClient = useQueryClient();

	const handleSubmit = async e => {
		setIsLoading(true);
		e.preventDefault();
		try {
			const data = await login(email, password);
			console.log(data);
			const token = data.access_token;

			if (token) {
				setToken(token);
				const decoded = jwtDecode(token);
				await queryClient.refetchQueries(['profile']);
				if (decoded.roles.includes('admin')) {
					navigate('/admin');
				} else if (decoded.roles.includes('moderator')) {
					navigate('/moderator');
				} else if (decoded.roles.includes('su')) {
					navigate('/su');
				} else {
					navigate('/');
				}
			}
			setIsLoading(false);
		} catch (error) {
			setError('Ошибка авторизации. Пожалуйста, проверьте свои данные.');
			console.error('Login failed', error);
			setIsLoading(false);
		}
	};
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const auth = sessionStorage.getItem('auth');
		const redirect = params.get('redirect');
		const error = params.get('error');
		if (error) setError('Ошибка авторизации.');
		if (redirect) {
			if (auth) setIsFormLoading(true);
			else navigate(`/login`);
		}
	}, [location.search, navigate]);
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
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography level='h4'>Вход в аккаунт</Typography>
					</Box>
					{isFormLoading ? (
						<Stack
							justifyContent='center'
							alignItems='center'
							sx={{ width: '100%', height: '40vh' }}
						>
							<CircularProgress />
						</Stack>
					) : (
						<>
							<Stack spacing={1}>
								{error && (
									<Typography level='body-sm' color='danger'>
										{error}
									</Typography>
								)}
								<FormControl>
									<FormLabel>Почта</FormLabel>
									<Input
										placeholder='Введите почту'
										required
										type='email'
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
								</FormControl>
								<Stack>
									<PasswordField
										label={'Пароль'}
										password={password}
										setPassword={setPassword}
									/>
									<Link to='/recovery'>
										<Typography level='body-sm'>Забыли пароль?</Typography>
									</Link>
								</Stack>
								<Button loading={Boolean(isLoading)} type='submit'>
									Войти
								</Button>
							</Stack>
							<Divider />
							<VkAuthButton
								label={'Войти через ВКонтакте'}
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
								<Typography level='body-sm'>Нет аккаунта?</Typography>
								<Link to='/registration'>
									<Typography level='body-sm'>Зарегистрироваться</Typography>
								</Link>
							</Box>
						</>
					)}
				</Stack>
			</form>
		</Card>
	);
}

export default LoginForm;
