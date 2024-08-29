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

import { getFile } from '../../../api/files.js';

function AudioPlayerMini({ title, filename, pictureURL }) {
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
			const audioUrl = await getFile({
				contentType: 'podcasts',
				contentId: '1',
				fileName: '864f4bc35ae74079cfc6cbc19a7b376c.mp3',
			});

			if (isMounted) {
				if (waveSurferRef.current) {
					waveSurferRef.current.destroy();
				}

				waveSurferRef.current = WaveSurfer.create({
					container: waveFormRef.current,
					waveColor: '#16697A',
					progressColor: '#DB6400',
					height: 40,
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
				const imageUrl = await getFile({
					contentType: 'podcasts',
					contentId: '1',
					fileName: '1.png',
				});
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

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: '#2e2e2e',
				borderRadius: '16px',
				padding: 3,
				boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
				maxWidth: 600,
				margin: '0 auto',
				transition: 'transform 0.3s ease-in-out',
				'&:hover': {
					transform: 'scale(1.02)',
				},
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					mb: 2,
				}}
			>
				<Button
					onClick={togglePlayPause}
					sx={{
						color: '#FFFFFF',
						fontSize: '2rem',
						marginRight: 2,
						flexShrink: 0,
						height: 60,
						width: 60,
						borderRadius: '50%',
						backgroundColor: playing ? '#DB6400' : '#16697A',
						boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
						transition: 'background-color 0.3s ease',
						'&:hover': {
							backgroundColor: playing ? '#c55300' : '#145f6b',
						},
					}}
					variant='solid'
				>
					{playing ? (
						<PauseIcon fontSize='large' />
					) : (
						<PlayArrowIcon fontSize='large' />
					)}
				</Button>

				<AspectRatio ratio='1' sx={{ minWidth: 60, marginRight: 2 }}>
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
								objectFit: 'cover',
								borderRadius: '12px',
							}}
							onLoad={handleImageLoad}
						/>
					</Skeleton>
				</AspectRatio>

				<Typography
					level='h4'
					sx={{
						fontWeight: 700,
						color: '#FFFFFF',
						flexGrow: 1,
						maxWidth: 250,
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					{title ? title : 'Default Title'}
				</Typography>
			</Box>

			<Box
				sx={{
					width: '100%',
					mb: 2,
					position: 'relative',
				}}
			>
				<div className='wavesurfer' ref={waveFormRef} />
				{/* <Box
                    sx={{
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        right: 0,
                        height: 8,
                        backgroundColor: '#DB6400',
                        borderRadius: '0 0 8px 8px',
                        transform: `scaleX(${currentTime / duration || 0})`,
                        transformOrigin: 'left',
                        transition: 'transform 0.1s linear',
                    }}
                /> */}
			</Box>

			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					justifyContent: 'space-between',
				}}
			>
				<Typography sx={{ color: '#FFFFFF' }}>
					{Math.floor(currentTime)}s / {Math.floor(duration)}s
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography sx={{ color: '#FFFFFF', marginRight: 1 }}>
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
								backgroundColor: '#555555',
							},
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
}

export default AudioPlayerMini;
