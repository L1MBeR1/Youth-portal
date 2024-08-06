import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/joy/Box';

const PodcastsCard = ({ id, title, description, img }) => {
	const navigate = useNavigate();

	const handleRedirect = id => {
		navigate(`/blog/${id}`);
	};
	return (
		<Card
			variant='plain'
			sx={{
				display: 'flex',
				// maxWidth:'200px',
				p: 0,
				cursor: 'pointer',
				'--Card-radius': '20px',
				transition: 'transform 0.3s',
				'&:hover': {
					transform: 'scale(1.025)',
				},
			}}
			onClick={() => handleRedirect(id)}
		>
			<Stack direction='column' spacing={1.5} flexGrow={1}>
				<AspectRatio ratio='1'>
					<img src={img} alt={title} loading='lazy' />
				</AspectRatio>
				<Stack
					spacing={1}
					direction='column'
					flexGrow={1}
					justifyContent='space-between'
				>
					<Stack spacing={1}>
						<Typography level='title-lg'>{title}</Typography>
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
								{description ? description : <></>}
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		</Card>
	);
};

export default PodcastsCard;
