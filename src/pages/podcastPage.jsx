import { AspectRatio, Avatar, Stack, Typography } from '@mui/joy';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import DOMPurify from 'dompurify';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getPodcast } from '../api/podcastsApi.js';
import AudioPlayer from '../components/players/audio/audioPlayer.jsx';
import usePublicationsById from '../hooks/usePublicationById.js';
import { mainMargin } from '../themes/margins.js';

function PodcastPage() {
	const { id } = useParams();
	const createMarkup = html => {
		return { __html: DOMPurify.sanitize(html) };
	};

	const { data, isFetching } = usePublicationsById('podcast', getPodcast, id);
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
					<Stack direction={'column'} spacing={3}>
						<Stack
							sx={{
								gap: '30px',
								flexDirection: { xs: 'column', smx: 'row' },
							}}
						>
							<Stack
								alignItems={'center'}
								sx={{
									minWidth: '250px',
								}}
							>
								<AspectRatio
									ratio='1'
									sx={{
										overflow: 'hidden',
										width: '100%',
									}}
								>
									<img src={data.cover_uri} alt={data.title} />
								</AspectRatio>
							</Stack>
							<Stack direction={'column'} spacing={1}>
								<Typography level='title-xxxl' component={'h1'}>
									{data.title}
								</Typography>
								<Stack direction={'row'} alignItems={'center'} spacing={2}>
									<Avatar size='sm' src={data.profile_image_uri} />
									<Typography level='title-md'>{data.nickname}</Typography>
								</Stack>
							</Stack>
						</Stack>
						<AudioPlayer audioUrl={data.audio_uri} data={data} />
						<Stack direction={'column'} spacing={1}>
							<Typography level='title-xxl'>О подкасте </Typography>
							<Typography level='body-lg'>
								<Box
									dangerouslySetInnerHTML={createMarkup(data.description.desc)}
								/>
							</Typography>
						</Stack>
					</Stack>
				</Card>
			)}
		</Box>
	);
}

export default PodcastPage;
