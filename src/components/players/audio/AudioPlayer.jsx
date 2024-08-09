import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Slider, AspectRatio, Skeleton } from '@mui/joy';
import WaveSurfer from 'wavesurfer.js';
import '../styles.css';


// npm install wavesurfer.js
const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

async function fetchAndStoreFile(filename) {
    try {
        const response = await fetch(`${API_URL}/proxy/audio?filename=${filename}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching the file:', error);
        throw error;
    }
}

function AudioPlayer({ title, filename, pictureURL }) {
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const waveSurferRef = useRef(null);
    const waveFormRef = useRef(null);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadAudio = async () => {
            const audioUrl = await fetchAndStoreFile(filename);

            if (isMounted) {
                if (waveSurferRef.current) {
                    waveSurferRef.current.destroy();
                }

                waveSurferRef.current = WaveSurfer.create({
                    container: waveFormRef.current,
                    waveColor: '#0390C8',
                    progressColor: 'orange',
                    height: 50,
                    responsive: true,
                    normalize: true,
                    backend: 'MediaElement'
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

        loadAudio();

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
                // width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >


            {/* Верхняя строка с текущим временем */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography>{Math.floor(currentTime)}s</Typography>
                <Typography>{Math.floor(duration)}s</Typography>
            </Box>

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
                }}
            >

                <Button
                    onClick={togglePlayPause}
                    sx={{
                        color: 'var(--color-button-secondary)',
                        fontSize: '1.5rem',
                        marginRight: 2,
                        flexShrink: 0,
                    }}
                    variant="solid"
                >
                    {!playing ? '▶' : '⏸'}
                </Button>
                <AspectRatio ratio="1" sx={{ minWidth: 60 }}>
                    <Skeleton loading={loadingImage} variant="rectangular" sx={{ width: '100%', height: '100%' }}>
                        <img
                            src={pictureURL || ''}
                            alt={title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onLoad={handleImageLoad}
                        />
                    </Skeleton>
                </AspectRatio>


                <Box sx={{
                        maxWidth: "100px"
                    }}>
                    <Typography
                        level="h2"
                        sx={{
                            fontWeight: 700,
                            color: 'var(--color-text)',
                            marginRight: 'auto',
                            flexShrink: 0,
                            maxWidth: 300,
                        }}
                    >
                        {title ? title : 'Default Title'}
                    </Typography>
                </Box>



                <Box sx={{ flexGrow: 1, marginX: 2 }}>
                    <div className="wavesurfer" ref={waveFormRef} />
                </Box>



                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexShrink: 0,
                    }}
                >
                    <Typography sx={{ marginRight: 2, color: 'var(--color-text)' }}>Volume</Typography>
                    <Slider
                        value={volume}
                        onChange={handleVolumeChange}
                        min={0}
                        max={1}
                        step={0.01}
                        sx={{ width: 150 }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default AudioPlayer;
