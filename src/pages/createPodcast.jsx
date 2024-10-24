import { Avatar, Button, Input, Sheet, Stack, Typography } from '@mui/joy';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import React, { useEffect, useRef, useState } from 'react';
import { uploadFile } from '../api/files.js';
import { postPodcast, updatePodcast } from '../api/podcastsApi.js';
import { mainMargin } from '../themes/mainMargin.js';
import { getToken } from '../utils/authUtils/tokenStorage.js';

function CreatePodcast() {
	const MAX_DESCRIPTION = 300;
	const MAX_NAME = 100;

	const [coverFile, setCoverFile] = useState(null);
	const [audioFile, setAudioFile] = useState(null);
	const [isCoverDragging, setIsCoverDragging] = useState(false);
	const [isAudioDragging, setIsAudioDragging] = useState(false);

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);

	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([]);

	const textareaRef = useRef(null);

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

	const handleFileChange = (e, setFile) => {
		const file = e.target.files[0];
		setFile(file);
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

			console.log(createdPodcast);
			const podcastId = createdPodcast.id;

			const coverUrl = await uploadFile({
				contentType: 'podcasts',
				contentId: podcastId,
				file: coverFile,
			});
			console.log(coverUrl);

			const audioUrl = await uploadFile({
				contentType: 'podcasts',
				contentId: podcastId,
				file: audioFile,
			});
			console.log(audioUrl);

			const updatedPodcast = await updatePodcast(
				token,
				{
					cover_url: coverUrl,
					audio_url: audioUrl,
				},
				podcastId
			);

			console.log(updatedPodcast);

			return updatedPodcast;
		} catch (error) {
			console.error('Error in createAndUploadPodcast:', error);
			throw error;
		}
	};

	const handleCreatePodcast = async () => {
		if (!name || !description || !coverFile || !audioFile) {
			alert('Заполните все поля и загрузите файлы.');
			return;
		}

		setLoading(true);
		setResults([]);

		try {
			const { token } = await getToken();
			const podcastData = {
				title: name,
				description: description,
				cover_url: '',
				audio_url: '',
			};

			const updatedPodcast = await createAndUploadPodcast(
				token,
				podcastData,
				coverFile,
				audioFile
			);

			setResults(prevResults => [
				...prevResults,
				'Подкаст успешно создан!',
				`Обложка загружена: ${updatedPodcast.cover_url}`,
				`Аудио загружено: ${updatedPodcast.audio_url}`,
			]);
		} catch (error) {
			setResults(prevResults => [...prevResults, `Ошибка: ${error.message}`]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				marginX: mainMargin,
			}}
		>
			<Card
				variant='plain'
				sx={{
					marginTop: '40px',
					borderRadius: '30px',
					p: '25px',
					overflow: 'hidden',
				}}
			>
				<Stack spacing={2}>
					<Typography level='h1'>Создание подкаста</Typography>

					<Typography level='body-lg'>Название блога</Typography>
					<Input
						placeholder='Введите название блога'
						value={name}
						maxLength={MAX_NAME}
						onChange={handleNameChange}
						sx={{ marginBottom: '8px' }}
					/>

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

					<Typography level='body-lg'>Загрузка обложки</Typography>
					<Sheet
						onDrop={e => handleDrop(e, setCoverFile, setIsCoverDragging)}
						onDragOver={e => handleDragOver(e, setIsCoverDragging)}
						onDragLeave={() => handleDragLeave(setIsCoverDragging)}
						sx={{
							padding: '20px',
							border: `2px dashed ${isCoverDragging ? '#1976d2' : '#ccc'}`,
							borderRadius: '8px',
							backgroundColor: isCoverDragging ? '#f0f8ff' : '#fafafa',
							cursor: 'pointer',
							transition: 'border 0.3s ease-in-out',
						}}
					>
						<Stack direction={'column'} alignItems={'center'}>
							{coverFile ? (
								<>
									<Avatar
										src={URL.createObjectURL(coverFile)}
										sx={{ width: 150, height: 150, marginBottom: 2 }}
									/>
									<Button variant='soft' onClick={() => setCoverFile(null)}>
										Удалить обложку
									</Button>
								</>
							) : (
								<>
									<Button
										variant='solid'
										component='label'
										sx={{ marginTop: 2 }}
									>
										Выбрать файл
										<input
											type='file'
											accept='image/*'
											onChange={e => handleFileChange(e, setCoverFile)}
											style={{
												opacity: 0,
												position: 'absolute',
												width: '100%',
												height: '100%',
												cursor: 'pointer',
											}}
										/>
									</Button>
									<Typography level='body-sm'>
										или перетащите файл сюда
									</Typography>
								</>
							)}
						</Stack>
					</Sheet>

					<Typography level='body-lg'>Загрузка аудиофайла</Typography>
					<Sheet
						onDrop={e => handleDrop(e, setAudioFile, setIsAudioDragging)}
						onDragOver={e => handleDragOver(e, setIsAudioDragging)}
						onDragLeave={() => handleDragLeave(setIsAudioDragging)}
						sx={{
							padding: '20px',
							border: `2px dashed ${isAudioDragging ? '#1976d2' : '#ccc'}`,
							borderRadius: '8px',
							backgroundColor: isAudioDragging ? '#f0f8ff' : '#fafafa',
							cursor: 'pointer',
							transition: 'border 0.3s ease-in-out',
						}}
					>
						<Stack direction={'column'} alignItems={'center'}>
							{audioFile ? (
								<>
									<Typography level='body-md' sx={{ marginBottom: 2 }}>
										{audioFile.name}
									</Typography>
									<Button variant='soft' onClick={() => setAudioFile(null)}>
										Удалить аудиофайл
									</Button>
								</>
							) : (
								<>
									<Button
										variant='solid'
										component='label'
										sx={{ marginTop: 2 }}
									>
										Выбрать файл
										<input
											type='file'
											accept='audio/*'
											onChange={e => handleFileChange(e, setAudioFile)}
											style={{
												opacity: 0,
												position: 'absolute',
												width: '100%',
												height: '100%',
												cursor: 'pointer',
											}}
										/>
									</Button>
									<Typography level='body-sm'>
										или перетащите файл сюда
									</Typography>
								</>
							)}
						</Stack>
					</Sheet>

					<Stack direction={'row'} spacing={2}>
						<Button onClick={handleCreatePodcast} disabled={loading}>
							{loading ? 'Создание...' : 'Создать'}
						</Button>
						<Button color='danger' variant='soft'>
							Назад
						</Button>
					</Stack>

					<Sheet sx={{ marginTop: '20px' }}>
						{results.map((result, index) => (
							<Typography
								key={index}
								level='body-sm'
								sx={{ marginTop: '10px' }}
							>
								{result}
							</Typography>
						))}
					</Sheet>
				</Stack>
			</Card>
		</Box>
	);
}

export default CreatePodcast;
