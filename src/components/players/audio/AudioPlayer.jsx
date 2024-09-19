import { Box, IconButton, Slider, Stack, Typography } from '@mui/joy';
import React, { useEffect, useRef, useState } from 'react';
import '../styles.css';

import LoopIcon from '@mui/icons-material/Loop';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { PlayerTime } from '../../../utils/timeAndDate/playerTime';

function AudioPlayer({ audioUrl }) {
	const [playing, setPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(0.3);
	const [previousVolume, setPreviousVolume] = useState(0.3);
	const [isMuted, setIsMuted] = useState(false);
	const [isSeeking, setIsSeeking] = useState(false);
	const [isLooping, setIsLooping] = useState(false);

	const audioRef = useRef(null);

	useEffect(() => {
		const audio = audioRef.current;

		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
		};

		const handleTimeUpdate = () => {
			if (!isSeeking) {
				setCurrentTime(audio.currentTime);
			}
		};

		const handleEnded = () => {
			setPlaying(false);
		};

		if (audio) {
			audio.volume = volume;
			audio.addEventListener('loadedmetadata', handleLoadedMetadata);
			audio.addEventListener('timeupdate', handleTimeUpdate);
			audio.addEventListener('ended', handleEnded);
		}

		return () => {
			if (audio) {
				audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
				audio.removeEventListener('timeupdate', handleTimeUpdate);
				audio.removeEventListener('ended', handleEnded);
			}
		};
	}, [isSeeking, volume]);

	const togglePlayPause = () => {
		const audio = audioRef.current;

		if (audio) {
			if (playing) {
				audio.pause();
			} else {
				audio.play();
			}
			setPlaying(!playing);
		}
	};

	const toggleLoop = () => {
		const audio = audioRef.current;
		if (audio) {
			audio.loop = !isLooping;
			setIsLooping(!isLooping);
		}
	};

	const handleVolumeChange = (event, newValue) => {
		const audio = audioRef.current;
		setVolume(newValue);
		setIsMuted(newValue === 0);
		if (audio) {
			audio.volume = newValue;
		}
	};

	const toggleMute = () => {
		const audio = audioRef.current;

		if (audio) {
			if (isMuted) {
				setVolume(previousVolume);
				audio.volume = previousVolume;
			} else {
				setPreviousVolume(volume);
				setVolume(0);
				audio.volume = 0;
			}
			setIsMuted(!isMuted);
		}
	};

	const handleTimeSliderChange = (event, newValue) => {
		setCurrentTime(newValue);
		setIsSeeking(true);
	};

	const handleTimeSliderCommit = (event, newValue) => {
		const audio = audioRef.current;
		if (audio) {
			audio.currentTime = newValue;
		}
		setIsSeeking(false);
	};

	return (
		<Stack direction={'column'}>
			<audio ref={audioRef} src={audioUrl} />
			<Stack direction={'row'} alignItems={'center'}>
				<Typography sx={{ marginRight: 2 }}>
					{PlayerTime(Math.floor(currentTime))}
				</Typography>
				<Slider
					value={currentTime}
					onChange={handleTimeSliderChange}
					onChangeCommitted={handleTimeSliderCommit}
					min={0}
					max={duration || 100}
					variant='solid'
					color='primary'
					step={1}
					sx={{
						flexGrow: 1,
						width: '100%',
						'--Slider-trackSize': '6px',
						'--Slider-thumbSize': '6px',
						'& .MuiSlider-thumb': {
							width: 'var(--Slider-thumbSize)',
							height: 'var(--Slider-thumbSize)',
							borderRadius: '50%',
							transition:
								'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
						},
						'&:hover .MuiSlider-thumb': {
							'--Slider-thumbSize': '23px',
							width: 'var(--Slider-thumbSize)',
							height: 'var(--Slider-thumbSize)',
						},
					}}
				/>
				<Typography sx={{ marginLeft: 2 }}>
					{PlayerTime(Math.floor(duration))}
				</Typography>
			</Stack>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: '1fr auto 1fr',
					alignItems: 'center',
				}}
			>
				<Stack justifySelf={'start'}>
					<IconButton
						onClick={toggleLoop}
						variant='plain'
						color={isLooping ? 'primary' : 'neutral'}
					>
						<LoopIcon />
					</IconButton>
				</Stack>
				<Stack justifySelf={'center'}>
					<IconButton
						onClick={togglePlayPause}
						variant='solid'
						color='primary'
						sx={{
							'--IconButton-size': '40px',
						}}
					>
						{playing ? (
							<PauseIcon fontSize='large' />
						) : (
							<PlayArrowIcon fontSize='large' />
						)}
					</IconButton>
				</Stack>
				<Stack justifySelf={'end'} direction={'row'}>
					<IconButton onClick={toggleMute} variant='plain'>
						{isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
					</IconButton>
					<Slider
						value={volume}
						onChange={handleVolumeChange}
						min={0}
						max={1}
						step={0.025}
						sx={{
							minWidth: '75px',
							'--Slider-trackSize': '4px',
							'--Slider-thumbSize': '15px',
						}}
					/>
				</Stack>
			</Box>
		</Stack>
	);
}

export default AudioPlayer;
