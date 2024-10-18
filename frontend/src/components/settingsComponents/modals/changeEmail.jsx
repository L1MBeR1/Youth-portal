import Button from '@mui/joy/Button';
import DialogActions from '@mui/joy/DialogActions';
import DialogContent from '@mui/joy/DialogContent';
import DialogTitle from '@mui/joy/DialogTitle';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

import { Stack } from '@mui/joy';
import { toast } from 'sonner';
import { updateUserEmail } from '../../../api/usersApi';
import { logoutFunc } from '../../../utils/authUtils/logout';
import { getToken } from '../../../utils/authUtils/tokenStorage';
import PasswordField from '../../fields/passwordField';

function ChangeEmail({ id, open, setOpen }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const [password, setPassword] = useState('');
	const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (validator.isEmail(inputValue)) {
			setIsConfirmEnabled(true);
		} else {
			setIsConfirmEnabled(false);
		}
	}, [inputValue]);

	const handleConfirm = () => {
		if (isConfirmEnabled) {
			setIsLoading(true);
			updateEmail();
		}
	};

	const handleClose = () => {
		setOpen(false);
		setInputValue('');
	};

	const updateEmail = async () => {
		const { token, needsRedirect } = await getToken();
		if (needsRedirect) {
			await logoutFunc();
			navigate('/login');
			queryClient.removeQueries(['profile']);
			return null;
		}
		const updatedData = {
			email: inputValue,
			password,
		};
		const response = await updateUserEmail(id, token, updatedData);
		if (response) {
			await queryClient.refetchQueries(['profile']);
			setIsLoading(false);
			handleClose();
			console.log(response);
			toast.info(
				'Перейдите по ссылке, отправленной на ваш новый email для подтверждения'
			);
			return;
		}
		return;
	};

	return (
		<>
			<Modal open={open} onClose={handleClose}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<DialogTitle>
						<Typography level='title-lg'>Изменение почты</Typography>
					</DialogTitle>
					<Divider />
					<DialogContent>
						<Stack spacing={2}>
							<PasswordField
								label={'Пароль'}
								password={password}
								setPassword={setPassword}
							/>
							<Stack spacing={1}>
								<Typography level='body-md'>
									Введите новый email. Вам придет письмо для подтверждения —
									перейдите по ссылке в письме.
								</Typography>
								<FormControl sx={{ marginTop: 2 }}>
									<FormLabel>Новая почта</FormLabel>
									<Input
										placeholder={`Введите новую почту`}
										value={inputValue}
										onChange={e => setInputValue(e.target.value)}
										autoFocus
									/>
								</FormControl>
							</Stack>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							variant='solid'
							onClick={handleConfirm}
							disabled={!isConfirmEnabled}
							loading={isLoading}
						>
							Отправить письмо
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

export default ChangeEmail;
