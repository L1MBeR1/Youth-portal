import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Button from '@mui/joy/Button';
import DialogActions from '@mui/joy/DialogActions';
import DialogContent from '@mui/joy/DialogContent';
import DialogTitle from '@mui/joy/DialogTitle';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteUser } from '../../api/usersApi';
import { logoutFunc } from '../../utils/authUtils/logout';
import { getToken } from '../../utils/authUtils/tokenStorage';
import PasswordField from '../fields/passwordField';
function DeleteAccountModal({ id, unique, open, setOpen }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const [password, setPassword] = useState('');
	const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (inputValue === `Удалить аккаунт ${unique}`) {
			setIsConfirmEnabled(true);
		} else {
			setIsConfirmEnabled(false);
		}
	}, [inputValue, unique]);

	const handleConfirm = () => {
		if (isConfirmEnabled) {
			setIsLoading(true);
			deleteAccount();
		}
	};

	const handleClose = () => {
		setOpen(false);
		setInputValue('');
	};

	const deleteAccount = async () => {
		const { token, needsRedirect } = await getToken();
		if (needsRedirect) {
			await logoutFunc();
			navigate('/login');
			queryClient.removeQueries(['profile']);
			return null;
		}
		try {
			const response = await deleteUser(id, token, password);
			if (response) {
				setIsLoading(false);
				setOpen(false);
				console.log(response);
				toast.info(
					'Перейдите по ссылке, отправленной на ваш новый email для подтверждения'
				);
				setPassword('');
				setInputValue('');
			}
		} catch (error) {
			setError('Ошибка. Пожалуйста, проверьте свои данные.');
			setPassword('');
			setIsLoading(false);
		}
	};
	return (
		<>
			<Modal open={open} onClose={handleClose}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<DialogTitle>
						<WarningRoundedIcon color='danger' />
						<Typography level='title-lg' color='danger'>
							Внимание
						</Typography>
					</DialogTitle>
					<Divider />
					<DialogContent>
						{error && (
							<Typography level='body-sm' color='danger'>
								{error}
							</Typography>
						)}
						<Typography>
							Удаление аккаунта приведет к безвозвратной потере всех данных. Вам
							придет письмо для подтверждения — перейдите по ссылке в письме.
						</Typography>
						<PasswordField
							label={'Пароль'}
							password={password}
							setPassword={setPassword}
						/>
						<Typography>
							Для удаления аккаунта введите фразу:{' '}
							<Typography level='titel-md' color='danger'>
								Удалить аккаунт {unique}
							</Typography>
						</Typography>
						<FormControl sx={{ marginTop: 2 }}>
							<Input
								placeholder={`Введите фразу`}
								value={inputValue}
								onChange={e => setInputValue(e.target.value)}
								autoFocus
							/>
						</FormControl>
					</DialogContent>
					<DialogActions>
						<Button
							variant='solid'
							color='danger'
							loading={isLoading}
							onClick={handleConfirm}
							disabled={!isConfirmEnabled}
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

export default DeleteAccountModal;
