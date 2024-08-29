import InfoIcon from '@mui/icons-material/Info';
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
import validator from 'validator';

import NeutralModal from '../../modals/neutralModal';

import { updateUserEmail } from '../../../api/usersApi';
import { logoutFunc } from '../../../utils/authUtils/logout';
import { getToken } from '../../../utils/authUtils/tokenStorage';

function ChangeEmail({ id, open, setOpen }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

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
		};
		const response = await updateUserEmail(id, token, updatedData);
		if (response) {
			queryClient.removeQueries(['profile']);
			setIsLoading(false);
			setOpen(false);
			console.log(response);
			setIsSuccess(true);
			queryClient.removeQueries(['profile']);
			return;
		}
		return;
	};

	return (
		<>
			<NeutralModal
				open={isSuccess}
				setOpen={setIsSuccess}
				message={
					'Перейдите по ссылке, отправленной на ваш новый email для подтверждения'
				}
				position={{ vertical: 'bottom', horizontal: 'right' }}
				icon={<InfoIcon />}
			/>
			<Modal open={open} onClose={handleClose}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<DialogTitle>
						<Typography level='title-lg'>Изменение почты</Typography>
					</DialogTitle>
					<Divider />
					<DialogContent>
						<Typography level='body-md'>
							Введите новый адрес электронной почты. После ввода будет
							отправлено письмо для подтверждения. Перейдите по ссылке,
							отправленной на ваш новый email.
						</Typography>
						<FormControl sx={{ marginTop: 2 }}>
							<Input
								placeholder={`Введите новую почту`}
								value={inputValue}
								onChange={e => setInputValue(e.target.value)}
								autoFocus
							/>
						</FormControl>
					</DialogContent>
					<DialogActions>
						<Button
							variant='solid'
							onClick={handleConfirm}
							disabled={!isConfirmEnabled || isLoading}
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
