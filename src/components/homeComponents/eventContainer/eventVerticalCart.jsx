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
function EventVerticalCart({ data }) {
	return (
		<>
			<Card
				variant='plain'
				orientation='vertical'
				sx={{
					boxSizing: 'border-box',
					borderRadius: '30px',
					flexGrow: '1',
					height: '100%',
				}}
			>
				<CardOverflow>
					<AspectRatio
						minHeight='200px'
						maxHeight='200px'
						sx={{
							overflow: 'hidden',
							position: 'relative',
							'& img': {
								transition: 'transform 0.4s',
							},
							borderRadius: '30px',
						}}
					>
						<img
							className={'cover'}
							src={BlankImage}
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
								<Typography level='title-lg'>{data.title}</Typography>
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
						<Stack direction={'column'}>
							<Stack direction={'row'} spacing={0.5}>
								<EventIcon />
								<Typography level='body-sm'>{data.date}</Typography>
							</Stack>
							<Stack direction={'row'} spacing={0.5}>
								<RoomIcon />
								<Typography level='body-sm'>{data.address}</Typography>
							</Stack>
						</Stack>
						<Button>Подробнее</Button>
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}
export default EventVerticalCart;
