import {
    AspectRatio,
    Box,
    Button,
    Skeleton,
    Slider,
    Typography,
} from '@mui/joy';
import React, { useEffect, useRef, useState } from 'react';
import '../styles.css';

import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function AudioPlayerNoWS({ title, filename, pictureURL, audioUrl }) {
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false);  // Для отслеживания перемотки

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

        if (audio) {
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);
        }

        const loadImage = async () => {
            try {
                const imageUrl = pictureURL;
                setImageUrl(imageUrl);
            } catch (error) {
                console.error('Error loading the image:', error);
            }
        };

        loadImage();

        return () => {
            if (audio) {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [filename, isSeeking]);

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

    const handleVolumeChange = (event, newValue) => {
        const audio = audioRef.current;
        setVolume(newValue);
        if (audio) {
            audio.volume = newValue;
        }
    };

    const handleImageLoad = () => setLoadingImage(false);

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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
            }}
        >
            <Box
                sx={{
                    bgcolor: 'var(--color-background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: '0 0.5rem 0.5rem rgba(0, 0, 0, 0.2)',
                    width: '100%',
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
                        marginLeft: 2,
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography sx={{ marginRight: 2 }}>
                        {Math.floor(currentTime)}s
                    </Typography>

                    <Typography sx={{ marginLeft: 2 }}>
                        {Math.floor(duration)}s
                    </Typography>
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
            <Box>
                <Slider
                    value={currentTime}
                    onChange={handleTimeSliderChange}
                    onChangeCommitted={handleTimeSliderCommit}
                    min={0}
                    max={duration || 100} // Если продолжительность не загружена, устанавливаем временный максимум
                    step={1}
                    sx={{
                        flexGrow: 1,
                        width: '100%',
                        marginLeft: 2,
                        marginRight: 2,
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

            <audio ref={audioRef} src={audioUrl} />
        </Box>
    );
}

export default AudioPlayerNoWS;
