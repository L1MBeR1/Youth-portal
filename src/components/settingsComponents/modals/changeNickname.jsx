import InfoIcon from '@mui/icons-material/Info';
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack } from '@mui/joy';
import { updateUserNickname } from '../../../api/usersApi';
import { logoutFunc } from '../../../utils/authUtils/logout';
import { getToken } from '../../../utils/authUtils/tokenStorage';
import SuccessModal from '../../modals/successModal';

function ChangeNickname({ id, open, setOpen }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleClose = () => {
		setOpen(false);
		setInputValue('');
		setErrorMessage('');
	};

	const updateNickname = async () => {
		const { token, needsRedirect } = await getToken();
		setIsLoading(true);
		setErrorMessage('');

		if (needsRedirect) {
			await logoutFunc();
			navigate('/login');
			queryClient.removeQueries(['profile']);
			return null;
		}

		try {
			const updatedData = {
				nickname: inputValue,
			};
			const response = await updateUserNickname(id, token, updatedData);
			if (response) {
				await queryClient.refetchQueries(['profile']);
				setIsLoading(false);
				handleClose();
				setIsSuccess(true);
			}
		} catch (error) {
			console.error('Ошибка при обновлении ника:', error);
			setIsLoading(false);
			setErrorMessage('Данное имя занято. Попробуйте другое.');
		}
	};

	return (
		<>
			<SuccessModal
				open={isSuccess}
				setOpen={setIsSuccess}
				message={'Отображаемое имя успешно обновлено'}
				position={{ vertical: 'bottom', horizontal: 'right' }}
				icon={<InfoIcon />}
			/>
			<Modal open={open} onClose={handleClose}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<DialogTitle>
						<Typography level='title-lg'>
							Изменение отображаемого имени
						</Typography>
					</DialogTitle>
					<Divider />
					<DialogContent>
						<Stack spacing={2}>
							{errorMessage && (
								<Typography level='body-md' color='danger'>
									{errorMessage}
								</Typography>
							)}
							<FormControl sx={{ marginTop: 2 }}>
								<FormLabel>Новое имя</FormLabel>
								<Input
									placeholder={`Введите новое имя`}
									value={inputValue}
									onChange={e => setInputValue(e.target.value)}
									autoFocus
								/>
							</FormControl>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							variant='solid'
							onClick={updateNickname}
							disabled={inputValue.length === 0}
							loading={isLoading}
						>
							Сохранить
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

export default ChangeNickname;
