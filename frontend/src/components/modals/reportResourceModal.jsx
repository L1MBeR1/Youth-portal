import Button from '@mui/joy/Button';
import DialogActions from '@mui/joy/DialogActions';
import DialogContent from '@mui/joy/DialogContent';
import DialogTitle from '@mui/joy/DialogTitle';
import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ModalClose, Option, Select, Sheet, Stack } from '@mui/joy';
import { toast } from 'sonner';
import { createReport } from '../../api/reportsApi';
import { getToken } from '../../utils/authUtils/tokenStorage';

function ReportResourceModal({ id, open, setOpen, resourceType }) {
	const navigate = useNavigate();
	const [reason, setReason] = useState('');
	const [description, setDescription] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [error, setError] = useState('');
	const MAX_DESCRIPTION = 300;
	const handleClose = () => {
		setOpen(false);
		setReason('');
		setDescription('');
	};

	const textareaRef = useRef(null);
	const handleSubmit = async e => {
		setIsLoading(true);
		e.preventDefault();
		try {
			const { token, needsRedirect } = await getToken();
			if (needsRedirect) {
				navigate('/login');
				return;
			}
			const response = createReport(
				token,
				resourceType,
				id,
				reason,
				description
			);
			if (response) {
				setIsLoading(false);
				setOpen(false);
				console.log(response);
				toast.success('Жалоба успешно отправлена');
				setReason('');
				setDescription('');
			}
		} catch (error) {
			setError('Ошибка. Пожалуйста, проверьте свои данные.');
		} finally {
			setIsLoading(false);
		}
	};
	const handleDescriptionChange = event => {
		const value = event.target.value;
		setDescription(value);
		setIsExpanded(value.length > 30 || value.includes('\n'));
	};

	useEffect(() => {
		if (textareaRef.current) {
			if (isExpanded) {
				textareaRef.current.style.height = 'auto';
				textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
			} else {
				textareaRef.current.style.height = 'auto';
			}
		}
	}, [description, isExpanded]);
	return (
		<>
			<Modal open={open} onClose={handleClose}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<ModalClose />
					<DialogTitle>
						<Typography level='title-lg'>Создание жалобы</Typography>
					</DialogTitle>
					<Divider />
					<DialogContent
						sx={{
							width: '300px',
						}}
					>
						{error && (
							<Typography level='body-sm' color='danger'>
								{error}
							</Typography>
						)}
						<Stack direction={'column'} gap={1.5}>
							<Stack direction={'column'} spacing={1}>
								<Typography>Причина жалобы</Typography>
								<Select
									value={reason}
									onChange={(e, newValue) => setReason(newValue)}
									placeholder='Выберите причину'
									required
								>
									<Option value='inappropriate'>Неподобающий контент</Option>
									<Option value='copyright'>Нарушение авторских прав</Option>
									<Option value='misinformation'>Дезинформация</Option>
								</Select>
							</Stack>
							<Stack direction={'column'} spacing={1}>
								<Typography>Дополнительные детали</Typography>
								<Sheet
									variant='outlined'
									sx={{
										position: 'relative',
										width: '100%',
										borderRadius: '20px',
										display: 'flex',
										flexDirection: 'column',
										background: 'var(--joy-palette-main-background)',
										padding: { xs: '4px 20px', md: '12px 20px' },
									}}
								>
									<textarea
										disabled={isLoading}
										placeholder='Введите описание'
										value={description}
										maxLength={MAX_DESCRIPTION}
										onChange={handleDescriptionChange}
										ref={textareaRef}
										style={{
											fontFamily: 'inter',
											fontSize: 'clamp(0.85rem, 3vw, 1rem)',
											resize: 'none',
											width: '100%',
											padding: '0',
											paddingTop: '7px',
											paddingBottom: isExpanded ? '10px' : '0',
											boxSizing: 'border-box',
											minHeight: '40px',
											border: 'none',
											outline: 'none',
											background: 'var(--joy-palette-main-background)',
											overflow: 'hidden',
										}}
										rows={1}
									/>
									<Typography
										level='body-xs'
										sx={{ ml: 'auto', textAlign: 'right', color: '#888' }}
									>
										{description.length} / {MAX_DESCRIPTION} символов
									</Typography>
								</Sheet>
							</Stack>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button type='submit' onClick={handleSubmit} disabled={!reason}>
							Отправить жалобу
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</>
	);
}

export default ReportResourceModal;
