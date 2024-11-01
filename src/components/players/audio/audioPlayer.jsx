import {
	Box,
	IconButton,
	Option,
	Select,
	Slider,
	Stack,
	Typography,
} from '@mui/joy';
import React, { useEffect, useRef, useState } from 'react';

import Forward10Icon from '@mui/icons-material/Forward10';
import LoopIcon from '@mui/icons-material/Loop';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Replay10Icon from '@mui/icons-material/Replay10';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { getCookie, setCookie } from '../../../utils/cookie/cookieUtils';
import { PlayerTime } from '../../../utils/timeAndDate/playerTime';

function AudioPlayer({ audioUrl, data }) {
	const [playing, setPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(0.4);
	const [previousVolume, setPreviousVolume] = useState(0.4);
	const [isMuted, setIsMuted] = useState(false);
	const [isSeeking, setIsSeeking] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1);

	const audioRef = useRef(null);

	useEffect(() => {
		const savedVolume = getCookie('audioVolume');
		if (savedVolume !== undefined) {
			setVolume(parseFloat(savedVolume));
		}
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

		const handlePause = () => {
			setPlaying(false);
		};

		const handlePlay = () => {
			setPlaying(true);
		};

		const handleVisibilityChange = () => {
			if (!document.hidden && audio) {
				setPlaying(!audio.paused);
			}
		};

		if (audio) {
			audio.volume = volume;
			audio.playbackRate = playbackRate;
			audio.addEventListener('loadedmetadata', handleLoadedMetadata);
			audio.addEventListener('timeupdate', handleTimeUpdate);
			audio.addEventListener('ended', handleEnded);
			audio.addEventListener('pause', handlePause);
			audio.addEventListener('play', handlePlay);
			document.addEventListener('visibilitychange', handleVisibilityChange);
		}

		return () => {
			if (audio) {
				audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
				audio.removeEventListener('timeupdate', handleTimeUpdate);
				audio.removeEventListener('ended', handleEnded);
				audio.removeEventListener('pause', handlePause);
				audio.removeEventListener('play', handlePlay);
				document.removeEventListener(
					'visibilitychange',
					handleVisibilityChange
				);
			}
		};
	}, [isSeeking, volume, playbackRate]);

	useEffect(() => {
		const audio = audioRef.current;

		if ('mediaSession' in navigator && data) {
			const { title, nickname, cover_uri } = data;
			navigator.mediaSession.metadata = new window.MediaMetadata({
				title: title,
				artist: nickname,
				artwork: [
					{
						src: cover_uri,
						sizes: '512x512',
					},
				],
			});

			navigator.mediaSession.setActionHandler('play', () => {
				audio.play();
				setPlaying(true);
			});

			navigator.mediaSession.setActionHandler('pause', () => {
				audio.pause();
				setPlaying(false);
			});

			navigator.mediaSession.setActionHandler('seekbackward', () => {
				audio.currentTime = Math.max(0, audio.currentTime - 10);
			});

			navigator.mediaSession.setActionHandler('seekforward', () => {
				audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
			});
		}

		return () => {
			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = null;
				navigator.mediaSession.setActionHandler('play', null);
				navigator.mediaSession.setActionHandler('pause', null);
				navigator.mediaSession.setActionHandler('seekbackward', null);
				navigator.mediaSession.setActionHandler('seekforward', null);
			}
		};
	}, [audioUrl, data]);

	const togglePlayPause = () => {
		const audio = audioRef.current;

		if (audio) {
			if (playing) {
				audio.pause();
			} else {
				audio.play();
			}
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
		setVolume(newValue);
		setIsMuted(newValue === 0);
		const audio = audioRef.current;
		if (audio) {
			audio.volume = newValue;
			setCookie('audioVolume', newValue, 365);
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

	const handleRewind = () => {
		const audio = audioRef.current;
		if (audio) {
			audio.currentTime = Math.max(0, audio.currentTime - 10);
			setCurrentTime(audio.currentTime);
		}
	};

	const handleForward = () => {
		const audio = audioRef.current;
		if (audio) {
			audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
			setCurrentTime(audio.currentTime);
		}
	};

	return (
		<Stack direction={'column'} flexGrow={1} spacing={1.25}>
			<audio ref={audioRef} src={audioUrl} />
			<Stack direction={'column'}>
				<Stack direction={'row'} alignItems={'center'}>
					<Box
						sx={{
							minWidth: { xs: '45px', md: '60px' },
							display: { xs: 'none', smx: 'block' },
						}}
					>
						<Typography level='body-sm'>
							{PlayerTime(Math.floor(currentTime))}
						</Typography>
					</Box>

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
					<Box
						sx={{
							justifyContent: 'flex-end',
							minWidth: { xs: '45px', md: '60px' },
							display: { xs: 'none', smx: 'flex' },
						}}
					>
						<Typography level='body-sm'>
							{PlayerTime(Math.floor(duration))}
						</Typography>
					</Box>
				</Stack>
				<Stack
					flexGrow={1}
					direction={'row'}
					justifyContent='space-between'
					sx={{ display: { xs: 'flex', smx: 'none' } }}
				>
					<Typography level='body-sm'>
						{PlayerTime(Math.floor(currentTime))}
					</Typography>
					<Typography level='body-sm'>
						{PlayerTime(Math.floor(duration))}
					</Typography>
				</Stack>
			</Stack>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: '1fr auto 1fr',
					alignItems: 'center',
				}}
			>
				<Stack justifySelf={'start'} direction={'row'} alignItems={'center'}>
					<IconButton
						onClick={toggleLoop}
						variant='plain'
						color={isLooping ? 'primary' : 'neutral'}
						sx={{ '--IconButton-size': { xs: '45px', smx: '50px' } }}
					>
						<LoopIcon />
					</IconButton>
					<Box sx={{ display: { xs: 'none', smx: 'block' } }}>
						<Select
							variant='plain'
							indicator={''}
							value={playbackRate}
							onChange={(e, value) => {
								setPlaybackRate(value);
							}}
							renderValue={selected => (
								<Box
									sx={{
										my: '10px',
									}}
								>
									<Typography level='title-lg'>{selected.label}</Typography>
								</Box>
							)}
						>
							<Option value={0.5}>0.5x</Option>
							<Option value={0.75}>0.75x</Option>
							<Option value={1}>1x</Option>
							<Option value={1.25}>1.25x</Option>
							<Option value={1.5}>1.5x</Option>
							<Option value={1.75}>1.75x</Option>
							<Option value={2}>2x</Option>
						</Select>
					</Box>
				</Stack>
				<Stack
					justifySelf={'center'}
					spacing={1.5}
					direction={'row'}
					alignItems={'center'}
				>
					<IconButton
						onClick={handleRewind}
						variant='plain'
						sx={{ '--IconButton-size': '55px' }}
					>
						<Replay10Icon />
					</IconButton>
					<IconButton
						onClick={togglePlayPause}
						variant='solid'
						color='primary'
						sx={{ '--IconButton-size': { xs: '50px', smx: '60px' } }}
					>
						{playing ? (
							<PauseIcon fontSize='large' />
						) : (
							<PlayArrowIcon fontSize='large' />
						)}
					</IconButton>
					<IconButton
						onClick={handleForward}
						variant='plain'
						sx={{ '--IconButton-size': { xs: '50px', smx: '55px' } }}
					>
						<Forward10Icon />
					</IconButton>
				</Stack>

				<Stack justifySelf={'end'} direction={'row'} alignItems={'center'}>
					<Box sx={{ display: { xs: 'block', smx: 'none' } }}>
						<Select
							variant='plain'
							indicator={''}
							value={playbackRate}
							onChange={(e, value) => {
								setPlaybackRate(value);
							}}
							renderValue={selected => (
								<Box
									sx={{
										my: '10px',
									}}
								>
									<Typography level='title-lg' sx={{ fontSize: '22px' }}>
										{selected.label}
									</Typography>
								</Box>
							)}
						>
							<Option value={0.5}>0.5x</Option>
							<Option value={0.75}>0.75x</Option>
							<Option value={1}>1x</Option>
							<Option value={1.25}>1.25x</Option>
							<Option value={1.5}>1.5x</Option>
							<Option value={1.75}>1.75x</Option>
							<Option value={2}>2x</Option>
						</Select>
					</Box>
					<Box
						sx={{
							display: { xs: 'none', smx: 'flex' },
						}}
					>
						<IconButton
							onClick={toggleMute}
							variant='plain'
							sx={{ '--IconButton-size': '45px' }}
						>
							{isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
						</IconButton>
						<Slider
							value={volume}
							onChange={handleVolumeChange}
							min={0}
							max={1}
							step={0.025}
							sx={{
								minWidth: '100px',
								'--Slider-trackSize': '4px',
								'--Slider-thumbSize': '15px',
							}}
						/>
					</Box>
				</Stack>
			</Box>
		</Stack>
	);
}

export default AudioPlayer;
