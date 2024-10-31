import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
	AspectRatio,
	Box,
	Button,
	Grid,
	Input,
	Sheet,
	Stack,
	Typography,
} from '@mui/joy';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addBlog } from '../../api/blogsApi.js';
import { uploadFile } from '../../api/files.js';
import { getToken } from '../../utils/authUtils/tokenStorage.js';
import QuillEditor from '../testing/BlogCreator/QuillEditor.jsx';
function CreateBlog() {
	const MAX_DESCRIPTION = 500;
	const MAX_NAME = 150;
	const MAX_FILE_SIZE_MB = process.env.REACT_APP_MAX_IMG_SIZE || 2;
	const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);

	const [content, setContent] = useState('');
	const [selectedImage, setSelectedImage] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [filePreview, setFilePreview] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const textareaRef = useRef(null);

	const navigate = useNavigate();
	const handleChildData = data => {
		console.log('Данные от дочернего компонента:', data);
		setContent(data);
	};

	const handleImageChange = e => {
		const file = e.target.files[0];
		if (file && file.size > MAX_FILE_SIZE) {
			setErrorMessage(`Размер файла превышает ${MAX_FILE_SIZE_MB}MB`);
			setSelectedImage(null);
			setFilePreview('');
		} else {
			setSelectedImage(file);
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

	const handleDrop = e => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file && file.size > MAX_FILE_SIZE) {
			setErrorMessage(`Размер файла превышает ${MAX_FILE_SIZE_MB}MB`);
		} else {
			setSelectedImage(file);
			setFilePreview(URL.createObjectURL(file));
			setErrorMessage('');
		}
	};
	const cancelSelection = () => {
		setSelectedImage(null);
		setFilePreview('');
		setErrorMessage('');
	};

	const isFormValid = name && description && content && selectedImage;
	const handleSubmit = async e => {
		setIsLoading(true);
		e.preventDefault();
		setErrorMessage('');

		try {
			const { token, needsRedirect } = await getToken();
			if (needsRedirect) {
				navigate('/login');
				return;
			}
			let coverImageUri = '';

			if (selectedImage) {
				coverImageUri = await uploadFile({
					contentType: 'blogs',
					contentId: `${Math.round(Math.random() * 100000)}`,
					file: selectedImage,
				});
			}

			const response = await addBlog(token, {
				title: name,
				description: {
					desc: description,
					meta: ['Что-то', 'сделать', 'с тегами'], // TODO: Добавить теги в создание
				},
				content: content,
				cover_uri: coverImageUri,
			});
			if (response) {
				toast.success('Блог успешно создан!');
				navigate('/my-content/blogs');
			} else {
				throw new Error('Ошибка при создании блога.');
			}
		} catch (error) {
			console.error(error);
			setErrorMessage(error.message || 'Произошла ошибка при создании блога');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDescriptionChange = event => {
		const value = event.target.value;
		setDescription(value);
		setIsExpanded(value.length > 30 || value.includes('\n'));
	};
	const handleNameChange = event => {
		setName(event.target.value);
	};
	useEffect(() => {
		if (isExpanded) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		} else {
			textareaRef.current.style.height = 'auto';
		}
	}, [description, isExpanded]);

	return (
		<Box>
			<Stack direction={'column'} spacing={3}>
				<Stack direction={'column'} spacing={2}>
					<Box>
						<Button
							size='sm'
							variant='soft'
							startDecorator={<ArrowBackIosNewIcon />}
							onClick={() => {
								navigate('/my-content/blogs');
							}}
							disabled={isLoading}
						>
							Назад
						</Button>
					</Box>
					<Typography level='title-xl'>Создание блога</Typography>
				</Stack>
				<Typography level='body-md'>
					Заполните форму ниже, чтобы опубликовать новый блог. Необходимо
					заполнить все поля.
				</Typography>
				<form onSubmit={handleSubmit}>
					<Stack direction={'column'} spacing={3}>
						<Stack direction={'column'} spacing={1}>
							<Typography level='title-lg'>Заголовок</Typography>
							<Input
								fullWidth
								value={name}
								maxLength={MAX_NAME}
								onChange={handleNameChange}
								placeholder='Введите заголовок для блога'
								sx={{ borderRadius: '20px' }}
								disabled={isLoading}
							/>
						</Stack>
						<Stack direction={'column'} spacing={1}>
							<Typography level='title-lg'>Описание</Typography>
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
									placeholder='Введите описание блога'
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
						<Stack direction={'column'} spacing={1}>
							<Typography level='title-lg'>Обложка</Typography>
							{selectedImage ? (
								<Grid container spacing={'20px'}>
									<Grid xs={12} md={6}>
										<AspectRatio
											minHeight='250px'
											maxHeight='250px'
											ratio='16/8'
											sx={{
												borderRadius: '20px',
												overflow: 'hidden',
												position: 'relative',
											}}
										>
											<img
												src={filePreview}
												alt={selectedImage.name}
												loading='lazy'
											/>
										</AspectRatio>
									</Grid>
									<Grid xs={12} md={6} direction={'column'}>
										<Stack spacing={2} alignItems={'center'}>
											<Typography
												level='body-sm'
												sx={{
													width: '100%',
													wordWrap: 'break-word',
													whiteSpace: 'pre-wrap',
													overflowWrap: 'anywhere',
												}}
											>
												{selectedImage.name}
											</Typography>

											<Button
												variant='soft'
												color='danger'
												disabled={isLoading}
												onClick={() => cancelSelection()}
											>
												Удалить обложку
											</Button>
										</Stack>
									</Grid>
								</Grid>
							) : (
								<Sheet
									onDrop={handleDrop}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									sx={{
										padding: '20px',
										border: `1px  ${
											isDragging ? 'dashed #1976d2' : 'solid #ccc'
										}`,
										borderRadius: '20px',
										backgroundColor: isDragging ? '#f0f8ff' : '#fafafa',
										cursor: 'pointer',
										transition: 'border 0.3s ease-in-out',
									}}
								>
									<Stack direction={'column'} alignItems={'center'}>
										{isDragging ? (
											<Box>
												<Typography
													level='body-lg'
													sx={{ textAlign: 'center' }}
												>
													Перетащите файл сюда
												</Typography>
											</Box>
										) : (
											<Stack
												spacing={1}
												direction={'column'}
												alignItems={'center'}
											>
												<Typography level='body-md'>
													Загрузка обложки (макс. {MAX_FILE_SIZE_MB}MB)
												</Typography>
												<Box>
													<Button variant='solid' component='label'>
														Выбрать файл
														<input
															type='file'
															accept='image/*'
															onChange={handleImageChange}
															style={{
																opacity: 0,
																position: 'absolute',
																width: '100%',
																height: '100%',
																cursor: 'pointer',
															}}
														/>
													</Button>
												</Box>
												<Typography level='body-sm'>
													или перетащите файл сюда
												</Typography>
											</Stack>
										)}
									</Stack>
								</Sheet>
							)}
						</Stack>

						<Stack direction={'column'} spacing={1}>
							<Typography level='title-lg'>Содержание</Typography>
							<Box>
								<QuillEditor
									value={content}
									onDataSend={handleChildData}
									isLoading={isLoading}
								/>
							</Box>
						</Stack>
						{errorMessage && (
							<Typography color='danger'>{errorMessage}</Typography>
						)}
						<Stack direction={'row'} spacing={3} justifyContent={'flex-end'}>
							<Box>
								<Button
									type='submit'
									variant='solid'
									color='primary'
									size='md'
									disabled={!isFormValid}
									loading={isLoading}
								>
									Создать
								</Button>
							</Box>
						</Stack>
					</Stack>
				</form>
			</Stack>
		</Box>
	);
}

export default CreateBlog;
