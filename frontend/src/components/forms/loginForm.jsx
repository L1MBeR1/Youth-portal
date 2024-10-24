import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi.js';
import { setToken } from '../../utils/authUtils/tokenStorage.js';
import PasswordField from '../fields/passwordField.jsx';

import { jwtDecode } from 'jwt-decode';

function LoginForm() {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);
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
				<Stack spacing={1.5}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography level='h4'>Вход в аккаунт</Typography>
					</Box>
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
				</Stack>
			</form>
		</Card>
	);
}

export default LoginForm;
