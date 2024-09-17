import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import React from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../components/players/audio/AudioPlayer.jsx';
import Player from '../components/players/audio/player.jsx';
import Player2 from '../components/players/audio/player2.jsx';
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
					<Player file={data.audio_uri} />
					<AudioPlayer pictureURL={data.cover_uri} audioUrl={data.audio_uri} />
					<Player2 file={data.audio_uri} />
				</Card>
			)}
		</Box>
	);
}

export default PodcastPage;
