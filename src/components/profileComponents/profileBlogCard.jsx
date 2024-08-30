import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardCover from '@mui/joy/CardCover';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatus } from '../../utils/getStatus';
import { timeAgo } from '../../utils/timeAndDate/timeAgo';

const ProfileBlogCard = ({ data, status }) => {
	const navigate = useNavigate();

	const handleRedirect = id => {
		navigate(`/blog/${id}`);
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
						width: '100%',
						height: '200px',
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
			<Stack direction='column' flexGrow={'1'} justifyContent='space-between'>
				<Stack paddingTop={'20px'} direction='column' flexGrow={1}>
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
				</Stack>
				<Stack
					paddingTop={'20px'}
					direction='row'
					alignItems='center'
					gap='15px'
					justifyContent={'space-between'}
				>
					<Stack direction='row' alignItems={'center'} gap='4px'>
						<VisibilityIcon sx={{ fontSize: 17, paddingBottom: '' }} />
						<Typography level='title-sm'>{data.views}</Typography>
					</Stack>
					<Typography level='body-sm'>{timeAgo(data.created_at)}</Typography>
				</Stack>
			</Stack>
		</Card>
	);
};

export default ProfileBlogCard;
