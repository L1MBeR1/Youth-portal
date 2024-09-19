import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import React from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../components/players/audio/audioPlayer.jsx';
import usePodcastById from '../hooks/usePodcastById';
import { mainMargin } from '../themes/mainMargin.js';

function PodcastPage() {
	const { id } = useParams();
	const { data, isFetching } = usePodcastById(id);
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
			{isFetching || !data ? (
				<></>
			) : (
				<Card
					variant='plain'
					sx={{
						marginTop: '40px',
						borderRadius: '30px',
						p: '25px',
						overflow: 'hidden',
					}}
				>
					<AudioPlayer audioUrl={data.audio_uri} />
				</Card>
			)}
		</Box>
	);
}

export default PodcastPage;
