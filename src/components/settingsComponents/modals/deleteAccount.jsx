import React, { useState, useEffect } from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import FormControl from '@mui/joy/FormControl';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';

function DeleteAccountModal({ nickname, onConfirm, open, setOpen }) {
	const [inputValue, setInputValue] = useState('');
	const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

	useEffect(() => {
		if (inputValue === `Удалить аккаунт ${nickname}`) {
			setIsConfirmEnabled(true);
		} else {
			setIsConfirmEnabled(false);
		}
	}, [inputValue, nickname]);

	const handleConfirm = () => {
		if (isConfirmEnabled) {
			onConfirm(true);
			setOpen(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setInputValue('');
	};

	return (
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
							Удалить аккаунт {nickname}
						</Typography>
					</Typography>
					<FormControl sx={{ marginTop: 2 }}>
						<Input
							placeholder={`Удалить аккаунт ${nickname}`}
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
	);
}

export default DeleteAccountModal;
