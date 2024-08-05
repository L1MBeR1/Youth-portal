import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/joy/Box';

import ProfileBlank from '../img/profileBlank.png';
import { timeAgo } from '../utils/timeAndDate/timeAgo';

const BlogCart = ({
	id,
	title,
	description,
	img,
	avatar,
	creator,
	createDate,
}) => {
	const navigate = useNavigate();

	const handleRedirect = id => {
		navigate(`/blog/${id}`);
	};
	return (
		<Card
			variant='plain'
			sx={{
				display: 'flex',
				// minHeight: "340px",
				p: 0,
				cursor: 'pointer',
				'--Card-radius': '20px',
				overflow: 'hidden',
				'&:hover img': {
					transform: 'scale(1.075)',
				},
			}}
			onClick={() => handleRedirect(id)}
		>
			<Stack direction='column' spacing={1.5} flexGrow={1}>
				<AspectRatio
					minHeight='120px'
					maxHeight='200px'
					sx={{
						overflow: 'hidden',
						position: 'relative',
						'& img': {
							transition: 'transform 0.4s',
						},
					}}
				>
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

					<Stack
						direction='row'
						justifyContent='space-between'
						alignItems='center'
						spacing={2}
					>
						<Stack direction='row' alignItems='center' spacing={2}>
							<Avatar alt={creator} src={avatar ? avatar : ProfileBlank} />
							<Typography level='body-md'>{creator}</Typography>
						</Stack>
						<Typography level='body-md'>{timeAgo(createDate)}</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Card>
	);
};

export default BlogCart;
