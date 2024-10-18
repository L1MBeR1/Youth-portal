import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { Stack } from '@mui/joy';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';

import { toast } from 'sonner';
import { postResetPassword } from '../../api/authApi';
import PasswordField from '../fields/passwordField';

function ResetPasswordForm({ token }) {
	const [password, setPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [passwordRepeatError, setPasswordRepeatError] = useState('');
	const [passwordCriteria, setPasswordCriteria] = useState({
		length: false,
		specialChar: false,
		lowercase: false,
		uppercase: false,
	});
	const [error, setError] = useState('');
	const [passwordStrength, setPasswordStrength] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setPasswordCriteria({
			length: password.length >= 8,
			specialChar: /[!@#$%^&*-]/.test(password),
			lowercase: /[a-z]/.test(password),
			uppercase: /[A-Z]/.test(password),
		});
		setPasswordStrength(zxcvbn(password));
	}, [password]);

	const getProgressColor = () => {
		const color = ['#f44336', '#ff9800', '#ffc107', '#84ad5b', '#3DAD44'];

		return color[Math.min(passwordStrength.score, color.length)];
	};
	const calculateProgress = score => {
		if (score > 0) {
			return (score / 4) * 100;
		} else return 3;
	};
	const getStrengthText = () => {
		switch (passwordStrength.score) {
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
			const response = await postResetPassword(token, password, passwordRepeat);
			if (response) {
				toast.success('Пароль успешно изменён!');
				navigate('/login');
			}
			setIsLoading(false);
		} catch (error) {
			setError('Ошибка сброса пароля, попробуйте позже');
			console.error('Reset password failed', error);
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
					<Stack spacing={2}>
						<Typography level='h4' sx={{ textAlign: 'center' }}>
							Сброс пароля
						</Typography>
						<Typography level='body-xs' sx={{ color: 'red' }}>
							{error}
						</Typography>
						<Stack spacing={0.5}>
							<PasswordField
								label='Введите новый пароль'
								password={password}
								setPassword={setPassword}
							/>
							<LinearProgress
								determinate
								size='sm'
								value={calculateProgress(passwordStrength.score)}
								sx={{
									bgcolor: 'background.level3',
									color: getProgressColor(),
								}}
							/>
							<Typography
								level='body-xs'
								sx={{ alignSelf: 'flex-end', color: 'hsl(var(--hue) 80% 30%)' }}
							>
								{getStrengthText()}
							</Typography>
						</Stack>
						<Stack>
							<Typography level='body-xs'>Пароль должен содержать:</Typography>
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
									{passwordCriteria.lowercase && passwordCriteria.uppercase ? (
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
						<PasswordField
							label='Повторите новый пароль'
							password={passwordRepeat}
							setPassword={setPasswordRepeat}
							error={passwordRepeatError}
						/>
						<Button
							type='submit'
							variant='solid'
							loading={isLoading}
							disabled={Boolean(
								!passwordCriteria.length ||
									!passwordCriteria.specialChar ||
									!passwordCriteria.lowercase ||
									!passwordCriteria.uppercase ||
									passwordRepeatError
							)}
						>
							Сбросить пароль
						</Button>
					</Stack>
				</form>
			</Card>
		</>
	);
}

export default ResetPasswordForm;
