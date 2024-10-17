import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { postChangePasswordMessage } from '../../api/authApi';
function RecoveryForm() {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const handleSubmit = async e => {
		e.preventDefault();
		setError('');
		setIsLoading(true);
		try {
			const response = await postChangePasswordMessage(email);
			if (response) {
				toast.info(
					'Перейдите по ссылке, отправленной на ваш новый email для подтверждения'
				);
				setIsLoading(false);
				navigate('/login');
			}
		} catch (error) {
			setError('Не удалось отправить письмо. Проверьте адрес почты.');
			setIsLoading(false);
		}
	};

	return (
		<>
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
					<Stack spacing={1}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Typography level='h4'>Восстановление пароля</Typography>
						</Box>
						{error && (
							<Typography level='body-sm' color='danger'>
								{error}
							</Typography>
						)}
						<Box>
							<Typography level='body-md'>
								Введите адрес почты, на которую зарегистрирован аккаунт
							</Typography>
						</Box>
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

						<Button type='submit' loading={isLoading}>
							Продолжить
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
							<Link to='/login'>
								<Typography level='body-sm'>Войти в аккаунт</Typography>
							</Link>
						</Box>
					</Stack>
				</form>
			</Card>
		</>
	);
}

export default RecoveryForm;
