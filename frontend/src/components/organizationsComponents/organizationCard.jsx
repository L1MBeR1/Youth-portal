import React from 'react';

import { Box, Card, Stack } from '@mui/joy';
import AspectRatio from '@mui/joy/AspectRatio';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';

import BlankImage from '../../img/blank.png';

import { useNavigate } from 'react-router-dom';
function OrganizationCard({ data }) {
	const navigate = useNavigate();
	const handleRedirect = id => {
		navigate(`/organization/${id}`);
	};
	return (
		<>
			<Card
				variant='plain'
				orientation='vertical'
				sx={{
					padding: '20px',
					boxSizing: 'border-box',
					borderRadius: '30px',
					flexGrow: '1',
					height: '100%',
					cursor: 'pointer',
					'&:hover .cover': {
						transform: 'scale(1.075)',
					},
				}}
				onClick={() => {
					handleRedirect(data.id);
				}}
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
						sx={{ marginTop: '5px' }}
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
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}
export default OrganizationCard;
