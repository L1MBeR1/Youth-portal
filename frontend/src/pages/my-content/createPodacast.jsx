import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
	AspectRatio,
	Button,
	Grid,
	Input,
	Sheet,
	Stack,
	Typography,
} from '@mui/joy';
import Box from '@mui/joy/Box';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { uploadFile } from '../../api/files';
import { postPodcast, updatePodcast } from '../../api/podcastsApi';
import { getToken } from '../../utils/authUtils/tokenStorage';
function CreatePodcast() {
	const MAX_DESCRIPTION = 500;
	const MAX_NAME = 150;
	const MAX_FILE_SIZE_MB = process.env.REACT_APP_MAX_IMG_SIZE || 2;
	const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedAudio, setSelectedAudio] = useState(null);
	const [isCoverDragging, setIsCoverDragging] = useState(false);
	const [isAudioDragging, setIsAudioDragging] = useState(false);
	const [coverPreview, setCoverPreview] = useState('');
	const [audioPreview, setAudioPreview] = useState('');

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);

	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const textareaRef = useRef(null);

	const navigate = useNavigate();
	const handleNameChange = event => {
		setName(event.target.value);
	};

	const handleDescriptionChange = event => {
		const value = event.target.value;
		setDescription(value);
		setIsExpanded(value.length > 30 || value.includes('\n'));
	};

	useEffect(() => {
		if (isExpanded) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		} else {
			textareaRef.current.style.height = 'auto';
		}
	}, [description, isExpanded]);

	const handleImageChange = e => {
		const file = e.target.files[0];
		if (file && file.size > MAX_FILE_SIZE) {
			setErrorMessage(`Размер файла превышает ${MAX_FILE_SIZE_MB}MB`);
			setSelectedImage(null);
			setCoverPreview('');
		} else {
			setSelectedImage(file);
			setCoverPreview(URL.createObjectURL(file));
			setErrorMessage('');
		}
	};

	const handleAudioChange = e => {
		const file = e.target.files[0];
		if (file && file.size > MAX_FILE_SIZE) {
			setErrorMessage(`Размер файла превышает ${MAX_FILE_SIZE_MB}MB`);
			setSelectedAudio(null);
			setAudioPreview('');
		} else {
			setSelectedAudio(file);
			setAudioPreview(URL.createObjectURL(file));
			setErrorMessage('');
		}
	};
	const handleDragOver = (e, setDragging) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = setDragging => {
		setDragging(false);
	};

	const handleDrop = (e, setFile, setDragging) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		setFile(file);
		setDragging(false);
	};
	const isFormValid = name && description && selectedAudio && selectedImage;
	const createAndUploadPodcast = async (
		token,
		podcastData,
		coverFile,
		audioFile
	) => {
		try {
			const createdPodcast = await postPodcast(token, {
				title: podcastData.title,
				description: podcastData.description,
			});

			console.log('Создан подкаст:', createdPodcast);
			const podcastId = createdPodcast.data.podcast.id;

			const coverUrl = await uploadFile({
				contentType: 'podcasts',
				contentId: podcastId,
				file: coverFile,
			});
			console.log('URL обложки:', coverUrl);

			const audioUrl = await uploadFile({
				contentType: 'podcasts',
				contentId: podcastId,
				file: audioFile,
			});
			console.log('URL аудио:', audioUrl);

			const updatedPodcast = await updatePodcast(
				token,
				{
					title: podcastData.title,
					description: podcastData.description,
					cover_uri: coverUrl,
					audio_uri: audioUrl,
				},
				podcastId
			);

			console.log('Обновленный подкаст:', updatedPodcast);

			return updatedPodcast;
		} catch (error) {
			console.error('Ошибка при создании и загрузке подкаста:', error);
			throw error;
		}
	};

	const handleSubmit = async () => {
		console.log(selectedAudio, selectedImage, name, description);
		setIsLoading(true);

		try {
			const { token } = await getToken();

			const podcastData = {
				title: name,
				description: description,
			};

			const response = await createAndUploadPodcast(
				token,
				podcastData,
				selectedImage,
				selectedAudio
			);
			if (response) {
				toast.success('Подкаст успешно создан!');
				navigate('/my-content/podcasts');
			} else {
				throw new Error('Ошибка при создании подкаста.');
			}
		} catch (error) {
			console.error(error);
			setErrorMessage(
				error.message || 'Произошла ошибка при создании подкаста'
			);
		} finally {
			setIsLoading(false);
		}
	};
	const cancelSelectionCover = () => {
		setSelectedImage(null);
		setCoverPreview('');
		setErrorMessage('');
	};

	const cancelSelectionAudio = () => {
		setSelectedAudio(null);
		setAudioPreview('');
		setErrorMessage('');
	};
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
					<Typography level='title-xl'>Создание подкаста</Typography>
				</Stack>
				<Typography level='body-md'>
					Заполните форму ниже, чтобы опубликовать новый подкаст. Необходимо
					заполнить все поля.
				</Typography>
				<form>
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
								<Grid container spacing={1}>
									<Grid xs={12} md={6}>
										<AspectRatio
											minHeight='250px'
											maxHeight='250px'
											ratio='1/1'
											sx={{
												borderRadius: '20px',
												overflow: 'hidden',
												position: 'relative',
											}}
										>
											<img
												src={coverPreview}
												alt={selectedImage.name}
												loading='lazy'
											/>
										</AspectRatio>
									</Grid>
									<Grid xs={12} md={6} direction={'column'}>
										<Stack spacing={2}>
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
											<Box>
												<Button
													variant='soft'
													color='danger'
													disabled={isLoading}
													onClick={() => cancelSelectionCover()}
												>
													Удалить обложку
												</Button>
											</Box>
										</Stack>
									</Grid>
								</Grid>
							) : (
								<Sheet
									onDrop={e =>
										handleDrop(e, setSelectedImage, setIsCoverDragging)
									}
									onDragOver={e => handleDragOver(e, setIsCoverDragging)}
									onDragLeave={() => handleDragLeave(setIsCoverDragging)}
									sx={{
										padding: '20px',
										border: `1px  ${
											isCoverDragging
												? 'dashed var(--joy-palette-main-primary)'
												: 'solid var(--joy-palette-neutral-outlinedBorder)'
										}`,
										borderRadius: '20px',
										backgroundColor: 'var(--joy-palette-main-background)',
										cursor: 'pointer',
										transition: 'border 0.3s ease-in-out',
									}}
								>
									<Stack direction={'column'} alignItems={'center'}>
										{isCoverDragging ? (
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
							{selectedAudio ? (
								<Grid container spacing={'20px'}>
									<Grid xs={12} md={6}>
										<audio controls src={audioPreview}></audio>
									</Grid>
									<Grid xs={12} md={6} direction={'column'}>
										<Stack spacing={2}>
											<Typography
												level='body-sm'
												sx={{
													width: '100%',
													wordWrap: 'break-word',
													whiteSpace: 'pre-wrap',
													overflowWrap: 'anywhere',
												}}
											>
												{selectedAudio.name}
											</Typography>
											<Box>
												<Button
													variant='soft'
													color='danger'
													disabled={isLoading}
													onClick={() => cancelSelectionAudio()}
												>
													Удалить файл
												</Button>
											</Box>
										</Stack>
									</Grid>
								</Grid>
							) : (
								<Sheet
									onDrop={e =>
										handleDrop(e, setSelectedAudio, setIsAudioDragging)
									}
									onDragOver={e => handleDragOver(e, setIsAudioDragging)}
									onDragLeave={() => handleDragLeave(setIsAudioDragging)}
									sx={{
										padding: '20px',
										border: `1px  ${
											isAudioDragging
												? 'dashed var(--joy-palette-main-primary)'
												: 'solid var(--joy-palette-neutral-outlinedBorder)'
										}`,
										borderRadius: '20px',
										backgroundColor: 'var(--joy-palette-main-background)',
										cursor: 'pointer',
										transition: 'border 0.3s ease-in-out',
									}}
								>
									<Stack direction={'column'} alignItems={'center'}>
										{isAudioDragging ? (
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
													Загрузка аудио (макс. {MAX_FILE_SIZE_MB}MB)
												</Typography>
												<Box>
													<Button variant='solid' component='label'>
														Выбрать файл
														<input
															type='file'
															accept='audio/*'
															onChange={handleAudioChange}
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
						{errorMessage && (
							<Typography color='danger'>{errorMessage}</Typography>
						)}
						<Stack direction={'row'} spacing={3} justifyContent={'flex-end'}>
							<Box>
								<Button
									variant='solid'
									color='primary'
									size='md'
									onClick={() => {
										handleSubmit();
									}}
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

export default CreatePodcast;
