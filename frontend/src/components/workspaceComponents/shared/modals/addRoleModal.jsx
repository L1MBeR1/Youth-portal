import React, { useState } from 'react';

import Button from '@mui/joy/Button';
import DialogActions from '@mui/joy/DialogActions';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';

import Add from '@mui/icons-material/Add';

import SuccessNotification from './successNotification.jsx';
import WarningModal from './warningModal.jsx';
function AddRoleModal({ func, label, message, successMessage }) {
	const [isSuccess, setIsSuccess] = useState(false);
	const [waitConfirm, setWaitConfirm] = useState(false);

	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const addModerator = async confirmed => {
		if (confirmed) {
			try {
				await func(email);
				handleClose();
				setIsSuccess(true);
			} catch (error) {
				console.error('Fetching moderators failed', error);
				setError('Ошибка добавления, проверьте данные');
			}
		}
	};
	const handleClose = () => {
		setEmail('');
		setIsOpen(false);
		setError('');
	};
	const handleChange = value => {
		setError('');
		setEmail(value);
	};
	const handleSubmit = e => {
		e.preventDefault();
		setWaitConfirm(true);
	};
	return (
		<>
			<Button
				startDecorator={<Add />}
				size='sm'
				onClick={() => {
					setIsOpen(true);
				}}
				sx={{
					ml: '10px',
				}}
			>
				Добавить
			</Button>
			<Modal
				aria-labelledby='close-modal-title'
				open={isOpen}
				onClose={() => {
					handleClose();
				}}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<ModalDialog>
					<ModalClose variant='outlined' />
					<Typography
						component='h2'
						id='close-modal-title'
						level='h4'
						textColor='inherit'
						fontWeight='lg'
					>
						{label}
					</Typography>
					<form onSubmit={handleSubmit}>
						<FormControl error={Boolean(error)}>
							<FormLabel>Почта</FormLabel>
							<Input
								placeholder='Введите почту'
								required
								type='email'
								value={email}
								onChange={e => handleChange(e.target.value)}
							/>
							<FormHelperText>{error}</FormHelperText>
						</FormControl>
						<DialogActions>
							<Button variant='solid' color='primary' type='submit'>
								Добавить
							</Button>
						</DialogActions>
					</form>
				</ModalDialog>
			</Modal>
			<SuccessNotification
				open={isSuccess}
				message={successMessage}
				setOpen={setIsSuccess}
			/>
			<WarningModal
				open={waitConfirm}
				setOpen={setWaitConfirm}
				onConfirm={addModerator}
				message={`${message} ${email}?`}
			/>
		</>
	);
}

export default AddRoleModal;
