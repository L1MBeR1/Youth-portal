import React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
function RecoveryForm() {
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
			<form>
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
					<Box>
						<Typography level='body-md'>
							Введите адрес почты на которую зарегистрирован аккаунт
						</Typography>
					</Box>
					<FormControl>
						<FormLabel>Почта</FormLabel>
						<Input placeholder='Введите почту' required />
					</FormControl>
					<Button type='submit'>Продолжить</Button>
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
	);
}
export default RecoveryForm;
