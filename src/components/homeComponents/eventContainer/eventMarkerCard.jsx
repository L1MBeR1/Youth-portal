import React from 'react';

import { Card, Box, Stack } from '@mui/joy';
import CardOverflow from '@mui/joy/CardOverflow';
import CardContent from '@mui/joy/CardContent';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import CardActions from '@mui/joy/CardActions';
import Button from '@mui/joy/Button';

import RoomIcon from '@mui/icons-material/Room';
import EventIcon from '@mui/icons-material/Event';

import { formatDate } from '../../../utils/timeAndDate/formatDate';
import BlankImage from '../../../img/blank.png';
import { useNavigate } from 'react-router-dom';
function EventMarkerCard({ data }) {
	const navigate = useNavigate();
	const fullAddress = `${data.address.country}, ${data.address.city}, ${data.address.street}, ${data.address.house}`;
	const handleRedirect = id => {
		navigate(`/event/${id}`);
	};
	return (
		<>
			<Card
				sx={{
					boxSizing: 'border-box',
					flexGrow: '1',
					height: '100%',
					p: '0',
				}}
			>
				<AspectRatio
					minHeight='200px'
					maxHeight='200px'
					sx={{
						overflow: 'hidden',
						position: 'relative',
						'& img': {
							transition: 'transform 0.4s',
						},
					}}
				>
					<img
						className={'cover'}
						src={BlankImage}
						alt={data.title}
						loading='lazy'
					/>
				</AspectRatio>
				<Stack
					direction={'column'}
					spacing={2}
					justifyContent={'space-between'}
					sx={{
						padding: '15px',
					}}
				>
					<Stack direction={'row'}>
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
							<Typography level='title-lg'>{data.name}</Typography>
						</Box>
					</Stack>
					<Stack direction={'column'}>
						<Stack direction={'row'} spacing={0.5}>
							<EventIcon />
							<Typography level='body-sm'>
								{formatDate(data.start_time)}
							</Typography>
						</Stack>
						<Stack direction={'row'} spacing={0.5}>
							<RoomIcon />
							<Typography level='body-sm'>{fullAddress}</Typography>
						</Stack>
					</Stack>
					<Button
						variant='soft'
						onClick={() => {
							handleRedirect(data.id);
						}}
					>
						Подробнее
					</Button>
				</Stack>
			</Card>
		</>
	);
}
export default EventMarkerCard;
