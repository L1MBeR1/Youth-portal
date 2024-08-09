import React, { useRef, useState } from 'react';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import '../styles.css';

function AudioPlayer({ title, src }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [onPlayIcon] = useState('⏸');
    const [onPauseIcon] = useState('▶');

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (playing) {
            audio.pause();
        } else {
            audio.play();
        }
        setPlaying(!playing);
    };

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
        audioRef.current.volume = newValue;
    };

    const handleProgressChange = (event, newValue) => {
        setCurrentTime(newValue);
        audioRef.current.currentTime = newValue;
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                bgcolor: 'var(--color-background)',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                padding: { xs: '1rem 1rem', sm: '1rem 1rem', md: '1.5rem 1rem' },
                marginX: { xs: '1rem 1rem', md: '1rem 1rem', lg: '1rem 1rem' },
                borderRadius: 2,
                boxShadow: '0 0.5rem 0.5rem rgba(0, 0, 0, 0.2)',
            }}
        >
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            />

            <Typography level="h2" sx={{ fontWeight: 700, marginBottom: 2, color: 'var(--color-text)' }}>
                {title ? title : 'Default Title'}
            </Typography>

            <Box sx={{ marginBottom: 3 }}>
                <Slider
                    value={currentTime}
                    min={0}
                    max={duration}
                    step={0.001}
                    onChange={handleProgressChange}
                    sx={{
                        width: '100%',
                        '& .MuiSlider-thumb': {
                            backgroundColor: 'var(--color-button-primary)',
                        },
                        '& .MuiSlider-rail': {
                            backgroundColor: 'rgba(80, 188, 215, 0.3)',
                        },
                        '& .MuiSlider-track': {
                            backgroundColor: 'var(--color-button-primary)',
                        },
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text)' }}>
                    <Typography>{Math.floor(currentTime)}</Typography>
                    <Typography>{Math.floor(duration)}</Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}>
                <Typography level="body3" sx={{ color: 'var(--color-text)' }}>Громкость</Typography>
                <Slider
                    value={volume}
                    min={0}
                    max={1}
                    step={0.001}
                    onChange={handleVolumeChange}
                    sx={{
                        width: '100%',
                        '& .MuiSlider-thumb': {
                            backgroundColor: 'var(--color-button-primary)',
                        },
                        '& .MuiSlider-rail': {
                            backgroundColor: 'rgba(80, 188, 215, 0.3)',
                        },
                        '& .MuiSlider-track': {
                            backgroundColor: 'var(--color-button-primary)',
                        },
                    }}
                />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    onClick={togglePlayPause}
                    sx={{
                        color: 'var(--color-button-secondary)',
                        fontSize: '1.5rem',
                    }}
                    variant="solid"
                >
                    {!playing ? onPauseIcon : onPlayIcon}
                </Button>
            </Box>
        </Box>
    );
}

export default AudioPlayer;
