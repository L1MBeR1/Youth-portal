import React from 'react';

import { Card, Box, Stack } from '@mui/joy';
import CardOverflow from '@mui/joy/CardOverflow';
import CardContent from '@mui/joy/CardContent';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import CardActions from '@mui/joy/CardActions';
import Button from '@mui/joy/Button';

import { formatDate } from '../../../utils/timeAndDate/formatDate';
import BlankImage from '../../../img/blank.png';
function EventHorizontalCart({ data }) {
	return (
		<>
			<Card
				variant='plain'
				orientation='horizontal'
				sx={{
					borderRadius: '30px',
					flexGrow: '1',
				}}
			>
				<CardOverflow>
					<AspectRatio ratio='4/3' maxHeight={195} sx={{ minWidth: 100 }}>
						<img src={BlankImage} alt={data.title} />
					</AspectRatio>
				</CardOverflow>
				<CardContent>
					<Stack direction={'column'}>
						<Stack direction={'row'} justifyContent={'space-between'}>
							<Typography>{data.title}</Typography>
							<Typography>{data.date}</Typography>
						</Stack>
						<Stack direction={'row'}>
							<Typography>{data.description}</Typography>
						</Stack>
						<Stack direction={'row'} justifyContent={'space-between'}>
							<Typography>{data.address}</Typography>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}
export default EventHorizontalCart;
