import InfoIcon from '@mui/icons-material/Info';
import { Stack } from '@mui/joy';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import DialogActions from '@mui/joy/DialogActions';
import DialogContent from '@mui/joy/DialogContent';
import DialogTitle from '@mui/joy/DialogTitle';
import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfileImage, updateProfileImage } from '../../../api/usersApi';
import { logoutFunc } from '../../../utils/authUtils/logout';
import { getToken } from '../../../utils/authUtils/tokenStorage';
import SuccessModal from '../../modals/successModal';

const MAX_FILE_SIZE_MB = process.env.REACT_APP_MAX_IMG_SIZE || 2;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

function ChangeProfileImage({ id, open, setOpen }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [filePreview, setFilePreview] = useState('');
	const [isDragging, setIsDragging] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleClose = () => {
		setOpen(false);
		setSelectedFile(null);
		setFilePreview('');
		setErrorMessage('');
	};

	const saveAvatar = async () => {
		const { token, needsRedirect } = await getToken();
		setIsLoading(true);
		if (needsRedirect) {
			await logoutFunc();
			navigate('/login');
			queryClient.removeQueries(['profile']);
			return null;
		}

		try {
			const formData = new FormData();
			formData.append('file', selectedFile);
			const uploadResponse = await loadProfileImage(id, token, formData);
			const fileUrl = uploadResponse.filename;
			const updateData = { profile_image_uri: fileUrl };
			await updateProfileImage(id, token, updateData);
			await queryClient.refetchQueries(['profile']);
			setIsLoading(false);
			setIsSuccess(true);
			handleClose();
		} catch (error) {
			console.error('Ошибка при сохранении аватара:', error);
			setIsLoading(false);
			setErrorMessage(
				'Ошибка при загрузке файла. Пожалуйста, попробуйте еще раз.'
			);
		}
	};

	const handleFileChange = e => {
		const file = e.target.files[0];
		if (file && file.size > MAX_FILE_SIZE) {
			setErrorMessage(`Размер файла превышает ${MAX_FILE_SIZE_MB}MB`);
			setSelectedFile(null);
			setFilePreview('');
		} else {
			setSelectedFile(file);
			setFilePreview(URL.createObjectURL(file));
			setErrorMessage('');
		}
	};

	const handleDrop = e => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file && file.size > MAX_FILE_SIZE) {
			setErrorMessage(`Размер файла превышает ${MAX_FILE_SIZE_MB}MB`);
			setSelectedFile(null);
			setFilePreview('');
		} else {
			setSelectedFile(file);
			setFilePreview(URL.createObjectURL(file));
			setErrorMessage('');
		}
	};

	const handleDragOver = e => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const cancelSelection = () => {
		setSelectedFile(null);
		setFilePreview('');
		setErrorMessage('');
	};

	return (
		<>
			<SuccessModal
				open={isSuccess}
				setOpen={setIsSuccess}
				message={'Аватар успешно обновлен'}
				position={{ vertical: 'bottom', horizontal: 'right' }}
				icon={<InfoIcon />}
			/>
			<Modal open={open} onClose={handleClose}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<DialogTitle>
						<Typography level='title-lg'>Изменение аватара</Typography>
					</DialogTitle>
					<Divider />
					<DialogContent>
						{errorMessage && (
							<Typography level='body-md' color='danger'>
								{errorMessage}
							</Typography>
						)}
						{filePreview ? (
							<Stack direction={'column'} alignItems={'center'} spacing={2}>
								<Typography level='title-md'>Выбранный файл</Typography>
								<Avatar
									src={filePreview}
									sx={{
										cursor: 'pointer',
										'--Avatar-ringSize': '10px',
										'--Avatar-size': '200px',
									}}
								/>
								<Button
									variant='soft'
									color='danger'
									sx={{ marginTop: 2 }}
									onClick={cancelSelection}
									disabled={isLoading}
								>
									Отменить выбор
								</Button>
							</Stack>
						) : (
							<Sheet
								onDrop={handleDrop}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								sx={{
									padding: '20px',
									border: `2px dashed ${isDragging ? '#1976d2' : '#ccc'}`,
									borderRadius: '8px',
									backgroundColor: isDragging ? '#f0f8ff' : '#fafafa',
									cursor: 'pointer',
									transition: 'border 0.3s ease-in-out',
								}}
							>
								<Stack
									direction={'column'}
									justifyContent={'center'}
									alignItems={'center'}
									spacing={1}
								>
									<Typography level='body-lg' sx={{ textAlign: 'center' }}>
										Загрузка картинки (макс. {MAX_FILE_SIZE_MB}MB)
									</Typography>
									<Button
										variant='solid'
										component='label'
										sx={{ marginTop: 2 }}
									>
										Выбрать файл
										<input
											type='file'
											accept='image/*'
											onChange={handleFileChange}
											style={{
												opacity: 0,
												position: 'absolute',
												width: '100%',
												height: '100%',
												cursor: 'pointer',
											}}
										/>
									</Button>
									<Typography level='body-sm' sx={{ textAlign: 'center' }}>
										или перетащите файл
									</Typography>
								</Stack>
							</Sheet>
						)}
					</DialogContent>
					<DialogActions>
						<Button
							variant='solid'
							onClick={saveAvatar}
							disabled={!selectedFile}
							loading={isLoading}
						>
							Сохранить
						</Button>
						<Button
							variant='soft'
							color='neutral'
							onClick={handleClose}
							disabled={isLoading}
						>
							Назад
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</>
	);
}

export default ChangeProfileImage;
