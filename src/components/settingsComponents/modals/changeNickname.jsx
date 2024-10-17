import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Stack, Tooltip } from '@mui/joy';
import Button from '@mui/joy/Button';
import CircularProgress from '@mui/joy/CircularProgress';
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
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getCheckNickName, updateUserNickname } from '../../../api/usersApi';
import { logoutFunc } from '../../../utils/authUtils/logout';
import { getToken } from '../../../utils/authUtils/tokenStorage';

function ChangeNickname({ id, open, setOpen }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
	const [checking, setChecking] = useState(false);
	const handleClose = () => {
		setOpen(false);
		setInputValue('');
		setErrorMessage('');
		setIsNicknameAvailable(false);
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
				toast.success('Отображаемое имя успешно обновлено');
			}
		} catch (error) {
			console.error('Ошибка при обновлении ника:', error);
			setIsLoading(false);
			setErrorMessage('Ошибка при обновлении ника');
		}
	};

	const checkNicknameAvailability = async nickname => {
		const { token } = await getToken();
		setChecking(true);
		try {
			const isAvailable = await getCheckNickName(token, nickname);
			setIsNicknameAvailable(isAvailable);
		} catch (error) {
			console.error(error);
			setErrorMessage('Ошибка при проверке ника.');
		} finally {
			setChecking(false);
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedCheckNickname = useCallback(
		debounce(nickname => {
			if (nickname.length > 0) {
				checkNicknameAvailability(nickname);
			} else {
				setIsNicknameAvailable(false);
			}
		}, 500),
		[]
	);

	const handleInputChange = e => {
		const value = e.target.value;
		setChecking(true);
		setInputValue(value);
		debouncedCheckNickname(value);
	};

	useEffect(() => {
		return () => {
			debouncedCheckNickname.cancel();
		};
	}, [debouncedCheckNickname]);

	return (
		<>
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
								<Stack direction='row' spacing={1} alignItems='center'>
									<Input
										sx={{ width: '100%' }}
										placeholder={`Введите новое имя`}
										value={inputValue}
										onChange={handleInputChange}
										autoFocus
										endDecorator={
											inputValue.length === 0 ? null : checking ? (
												<CircularProgress size='sm' />
											) : isNicknameAvailable ? (
												<CheckCircleOutlineIcon color='success' />
											) : (
												<Tooltip
													title='Данное имя занято'
													color='danger'
													placement='top-end'
													variant='plain'
												>
													<ErrorOutlineIcon color='danger' />
												</Tooltip>
											)
										}
									/>
								</Stack>
							</FormControl>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							variant='solid'
							onClick={updateNickname}
							disabled={
								inputValue.length === 0 || !isNicknameAvailable || checking
							}
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
