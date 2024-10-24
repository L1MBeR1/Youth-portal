import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CardContent, CardCover, CardOverflow, Chip } from '@mui/joy';
import { getStatus } from '../../utils/getStatus';
import { timeAgo } from '../../utils/timeAndDate/timeAgo';
const ProfilePodcastsCard = ({ data, status }) => {
	const navigate = useNavigate();

	const handleRedirect = id => {
		navigate(`/podcast/${id}`);
	};
	return (
		<Card
			variant='plain'
			sx={{
				display: 'flex',
				padding: '15px',
				cursor: 'pointer',
				'--Card-radius': '30px',
				bgcolor: 'var(--joy-palette-main-background)',
				flexGrow: '1',
				overflow: 'hidden',
				height: '100%',
				'&:hover .cover': {
					transform: 'scale(1.075)',
				},
				gap: '0',
			}}
			onClick={() => handleRedirect(data.id)}
		>
			<CardOverflow
				sx={{
					p: 0,
				}}
			>
				<Card
					variant='plain'
					sx={{
						aspectRatio: '1',
						width: '100%',
						position: 'relative',
						overflow: 'hidden',
						borderRadius: '0',
						p: 0,
					}}
				>
					<CardCover>
						<img
							src={data.cover_uri}
							alt={data.title}
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					</CardCover>
					{status && (
						<CardContent
							sx={{
								p: '25px',
							}}
						>
							<Chip size={'md'} color={getStatus(data.status).color}>
								{getStatus(data.status).label}
							</Chip>
						</CardContent>
					)}
				</Card>
			</CardOverflow>
			<Stack
				direction='column'
				spacing={1.5}
				flexGrow={1}
				sx={{
					mt: '20px',
				}}
			>
				<Typography level='title-lg'>{data.title}</Typography>
				<Typography level='body-sm'>{timeAgo(data.created_at)}</Typography>
			</Stack>
		</Card>
	);
};

export default ProfilePodcastsCard;
