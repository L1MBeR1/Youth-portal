import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/joy/Box';

const PodcastsCard = ({ data }) => {
	const navigate = useNavigate();

	const handleRedirect = id => {
		navigate(`/podcast/${id}`);
	};
	return (
		<Card
			variant='plain'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				// maxWidth:'200px',
				p: 0,
				flexGrow: '1',
				cursor: 'pointer',
				height: '100%',
				'--Card-radius': '20px',
				transition: 'transform 0.3s',
				'&:hover .cover': {
					transform: 'scale(1.075)',
				},
			}}
			onClick={() => handleRedirect(data.id)}
		>
			<CardOverflow>
				<AspectRatio
					ratio='1'
					sx={{
						overflow: 'hidden',
						position: 'relative',
						'& img': {
							transition: 'transform 0.4s',
						},
					}}
				>
					<img src={data.cover_uri} className={'cover'} alt={data.title} />
				</AspectRatio>
			</CardOverflow>
			<Stack direction='column' spacing={1.5} padding={'15px'} flexGrow={1}>
				<Stack
					spacing={1}
					direction='column'
					flexGrow={1}
					justifyContent='space-between'
				>
					<Box
						sx={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							whiteSpace: 'normal',
						}}
					>
						<Typography level='title-lg'>{data.title}</Typography>
					</Box>
					<Box
						sx={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							whiteSpace: 'normal',
						}}
					>
						<Typography level='body-md'>
							{data.description ? data.description.desc : <></>}
						</Typography>
					</Box>
				</Stack>
			</Stack>
		</Card>
	);
};

export default PodcastsCard;
