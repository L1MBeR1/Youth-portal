import React from 'react';

import { Box, Card, Stack } from '@mui/joy';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';

import EventIcon from '@mui/icons-material/Event';
import RoomIcon from '@mui/icons-material/Room';
import { useNavigate } from 'react-router-dom';
import BlankImage from '../../../img/blank.png';
import { formatDate } from '../../../utils/timeAndDate/formatDate';
function EventHorizontalCard({ data }) {
	const navigate = useNavigate();
	const handleRedirect = id => {
		navigate(`/event/${id}`);
	};
	const fullAddress = `${data.address.country}, ${data.address.city}, ${data.address.street}, ${data.address.house}`;
	return (
		<>
			<Card
				variant='plain'
				orientation='horizontal'
				sx={{
					boxSizing: 'border-box',
					borderRadius: '30px',
					flexGrow: '1',
					height: '100%',
				}}
			>
				<CardOverflow>
					<AspectRatio
						flex={true}
						sx={{ flexBasis: 200, width: '150px' }}
						// sx={{
						// 	width: '200px',
						// 	height: '100%',
						// 	overflow: 'hidden',
						// 	position: 'relative',
						// 	'& img': {
						// 		transition: 'transform 0.4s',
						// 	},
						// }}
					>
						<img
							className={'cover'}
							src={data.cover_uri ? data.cover_uri : BlankImage}
							alt={data.title}
							loading='lazy'
						/>
					</AspectRatio>
				</CardOverflow>
				<CardContent>
					<Stack
						direction={'column'}
						spacing={2}
						justifyContent={'space-between'}
						flexGrow={1}
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
								<Typography level='body-md'>{data.description}</Typography>
							</Box>
						</Stack>
						<Stack direction={'row'} justifyContent={'space-between'}>
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
							<Stack
								direction={'column'}
								justifyContent={'flex-end'}
								alignContent={'flex-end'}
							>
								<Button
									variant='soft'
									onClick={() => {
										handleRedirect(data.id);
									}}
								>
									Подробнее
								</Button>
							</Stack>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}
export default EventHorizontalCard;
