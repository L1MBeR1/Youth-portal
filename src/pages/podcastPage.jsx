import Box from '@mui/joy/Box';
import React from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../components/players/audio/AudioPlayer';
import AudioPlayerMini from '../components/players/audio/AudioPlayerMini';

function PodcastPage() {
	const { id } = useParams();
	const url =
		'https://www.dropbox.com/scl/fi/w29p4jx0a9gqsd8urjqxq/gena.mp3?rlkey=y3q2wplt6g4jvqa990x7nostc&st=az1rjytd&dl=1';

	return (
		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				marginX: { xs: '10px', md: '10%', lg: '15%' },
			}}
		>
			{/* Секция-заголовок */}

			{/* Секция плеера */}
			{/* <div>  */}

			<br />
			<br />
			<AudioPlayer
				styles={{ marginTop: '20px', marginBottom: '20px' }}
				// filename={"gena.mp3"}
				filename={'hotel_pools_melt.mp3'}
				title={'Название подкаста'}
				contentName=''
				contentId={''}
				// pictureURL={"https://images.unsplash.com/photo-1722808333348-1b61caa91203?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
				pictureURL={''}
			/>
			{/* </div> */}

			<br />
			<br />
			<br />

			<AudioPlayerMini
				// filename={"gena.mp3"}
				filename={'hotel_pools_melt.mp3'}
				title={'Название подкаста'}
				contentName=''
				contentId={''}
				// pictureURL={"https://images.unsplash.com/photo-1722808333348-1b61caa91203?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
				pictureURL={''}
			/>
		</Box>
	);
}

export default PodcastPage;
