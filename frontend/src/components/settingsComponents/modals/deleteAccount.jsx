import DeleteIcon from '@mui/icons-material/Delete';
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

import SuccessModal from '../../modals/successModal';

import { deleteUser } from '../../../api/usersApi';
import { logoutFunc } from '../../../utils/authUtils/logout';
import { getToken } from '../../../utils/authUtils/tokenStorage';
function DeleteAccountModal({ id, unique, open, setOpen }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [isSuccess, setIsSuccess] = useState(false);

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
		await logoutFunc();
		const response = await deleteUser(id, token);
		if (response) {
			navigate('/login');
			queryClient.removeQueries(['profile']);
			setIsLoading(false);
			setOpen(false);
			console.log(response);
			setIsSuccess(true);
			queryClient.removeQueries(['profile']);
		}
	};
	return (
		<>
			<SuccessModal
				open={isSuccess}
				setOpen={setIsSuccess}
				message={'Аккаунт успешно удалён'}
				position={{ vertical: 'bottom', horizontal: 'right' }}
				icon={<DeleteIcon />}
			/>
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
						<Typography>
							Удаление аккаунта приведет к безвозвратной потере всех данных.
						</Typography>
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
							onClick={handleConfirm}
							disabled={!isConfirmEnabled}
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

export default DeleteAccountModal;
