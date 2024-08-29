import React, { useState } from 'react';

import Button from '@mui/joy/Button';
import DialogActions from '@mui/joy/DialogActions';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Typography from '@mui/joy/Typography';

import SuccessNotification from './successNotification.jsx';
import WarningModal from './warningModal.jsx';
function ChangeStatusModal({ func, message, id, isOpen, setIsOpen }) {
	const [isSuccess, setIsSuccess] = useState(false);
	const [waitConfirm, setWaitConfirm] = useState(false);

	const [status, setStatus] = useState('');
	const [error, setError] = useState('');
	const changeStatus = async confirmed => {
		if (confirmed) {
			try {
				await func(status);
				handleClose();
				setIsSuccess(true);
			} catch (error) {
				console.error('Fetching moderators failed', error);
				setError('Ошибка изменения, проверьте данные');
			}
		}
	};
	const handleClose = () => {
		setStatus('');
		setIsOpen(false);
		setError('');
	};
	const handleChange = value => {
		console.log(value);
		setError('');
		setStatus(value);
	};
	const handleSubmit = e => {
		e.preventDefault();
		setWaitConfirm(true);
	};
	return (
		<>
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
						Изменить статус
					</Typography>
					<form onSubmit={handleSubmit}>
						<FormControl error={Boolean(error)}>
							<FormLabel>Статус</FormLabel>
							<Select
								required
								size='sm'
								value={status}
								onChange={(e, newValue) => handleChange(newValue)}
								placeholder='Выберите статус'
							>
								<Option value='moderating'>На проверке</Option>
								<Option value='published'>Опубликован</Option>
								<Option value='archived'>Архивирован</Option>
								<Option value='pending'>На доработке</Option>
							</Select>
							<FormHelperText>{error}</FormHelperText>
						</FormControl>
						<DialogActions>
							<Button variant='solid' color='primary' type='submit'>
								Изменить
							</Button>
						</DialogActions>
					</form>
				</ModalDialog>
			</Modal>
			<SuccessNotification
				open={isSuccess}
				message={'Статус успешно изменен'}
				setOpen={setIsSuccess}
			/>
			<WarningModal
				open={waitConfirm}
				setOpen={setWaitConfirm}
				onConfirm={changeStatus}
				message={message + ' ' + status}
			/>
		</>
	);
}

export default ChangeStatusModal;
