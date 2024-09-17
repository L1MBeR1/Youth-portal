import {
	AspectRatio,
	Box,
	Button,
	Skeleton,
	Slider,
	Typography,
} from '@mui/joy';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import '../styles.css';

import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// npm install wavesurfer.js

function AudioPlayer({ title, filename, pictureURL, audioUrl }) {
	const [playing, setPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(0.5);
	const [imageUrl, setImageUrl] = useState(null);
	const waveSurferRef = useRef(null);
	const waveFormRef = useRef(null);
	const [loadingImage, setLoadingImage] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const loadAudio = async () => {
			if (isMounted) {
				if (waveSurferRef.current) {
					waveSurferRef.current.destroy();
				}

				waveSurferRef.current = WaveSurfer.create({
					container: waveFormRef.current,
					waveColor: '#16697A',
					progressColor: '#DB6400',
					height: 1,
					responsive: true,
					normalize: true,
					backend: 'MediaElement',
				});

				waveSurferRef.current.load(audioUrl);

				waveSurferRef.current.on('ready', () => {
					setDuration(waveSurferRef.current.getDuration());
				});

				waveSurferRef.current.on('audioprocess', () => {
					setCurrentTime(waveSurferRef.current.getCurrentTime());
				});

				waveSurferRef.current.on('seek', () => {
					setCurrentTime(waveSurferRef.current.getCurrentTime());
				});
			}
		};

		const loadImage = async () => {
			try {
				const imageUrl = pictureURL;
				if (isMounted) {
					setImageUrl(imageUrl);
				}
			} catch (error) {
				console.error('Error loading the image:', error);
			}
		};

		loadAudio();
		loadImage();

		return () => {
			isMounted = false;
			if (waveSurferRef.current) {
				waveSurferRef.current.destroy();
			}
		};
	}, [filename]);

	const togglePlayPause = () => {
		if (waveSurferRef.current) {
			waveSurferRef.current.playPause();
			setPlaying(!playing);
		}
	};

	const handleVolumeChange = (event, newValue) => {
		setVolume(newValue);
		if (waveSurferRef.current) {
			waveSurferRef.current.setVolume(newValue);
		}
	};

	const handleImageLoad = () => setLoadingImage(false);

	// const progress = (currentTime / duration) * 100 || 0; // Рассчитываем процент прогресса

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			{/* Верхняя строка с текущим временем и прогрессом */}
			{/* <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Typography sx={{ minWidth: '40px' }}>{Math.floor(currentTime)}s</Typography>
                <Box sx={{ flexGrow: 1, mx: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress} // Передаем динамически рассчитанный прогресс
                    />
                </Box>
                <Typography sx={{ minWidth: '40px' }}>{Math.floor(duration)}s</Typography>
            </Box> */}

			{/* Основная часть */}
			<Box
				sx={{
					bgcolor: 'var(--color-background)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-around',
					padding: 2,
					borderRadius: 2,
					boxShadow: '0 0.5rem 0.5rem rgba(0, 0, 0, 0.2)',
					// width: '100%',
				}}
			>
				<Button
					onClick={togglePlayPause}
					sx={{
						color: 'var(--color-button-secondary)',
						backgroundColor: playing ? '#DB6400' : '#16697A',
						fontSize: '1.5rem',
						marginRight: 2,
						flexShrink: 0,
						height: 60,
						width: 60,
						borderRadius: '12px',
						'&:hover': {
							backgroundColor: playing ? '#c55300' : '#145f6b',
						},
					}}
					variant='solid'
				>
					{/* {playing ? '⏸' : '▶'} */}
					{playing ? (
						<PauseIcon fontSize='large' />
					) : (
						<PlayArrowIcon fontSize='large' />
					)}
				</Button>

				<AspectRatio ratio='1' sx={{ minWidth: 60 }}>
					<Skeleton
						loading={loadingImage}
						variant='rectangular'
						sx={{ width: '100%', height: '100%' }}
					>
						<img
							src={imageUrl || ''}
							alt={title}
							style={{
								width: '100%',
								height: '100%',
								marginRight: '20px',
								objectFit: 'cover',
							}}
							onLoad={handleImageLoad}
						/>
					</Skeleton>
				</AspectRatio>

				<Box sx={{ maxWidth: '100px' }}>
					<Typography
						level='h3'
						sx={{
							fontWeight: 700,
							color: 'var(--color-text)',
							marginLeft: 1,
							marginRight: 5,
							flexShrink: 0,
							maxWidth: 300,
						}}
					>
						{title ? title : 'Default Title'}
					</Typography>
				</Box>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						flexGrow: 1,
						marginLeft: 0,
					}}
				>
					{/* <Typography sx={{ marginLeft: 4, display: 'flex', alignItems: 'center' }}>{Math.floor(currentTime)}s</Typography> */}
					<div className='wavesurfer' ref={waveFormRef} />
					{/* <Typography sx={{ display: 'flex', alignItems: 'center' }}>{Math.floor(duration)}s</Typography> */}
				</Box>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexShrink: 0,
					}}
				>
					<Typography sx={{ color: '#000', marginRight: 1 }}>
						Громкость
					</Typography>
					<Slider
						value={volume}
						onChange={handleVolumeChange}
						min={0}
						max={1}
						step={0.01}
						sx={{
							width: 150,
							'& .MuiSlider-thumb': {
								backgroundColor: '#DB6400',
							},
							'& .MuiSlider-track': {
								backgroundColor: '#16697A',
							},
							'& .MuiSlider-rail': {
								backgroundColor: '#ccc',
							},
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
}

export default AudioPlayer;
