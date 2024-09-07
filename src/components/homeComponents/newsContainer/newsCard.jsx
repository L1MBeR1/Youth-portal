import React from 'react';

import { Box, Card, Stack } from '@mui/joy';
import AspectRatio from '@mui/joy/AspectRatio';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';

import BlankImage from '../../../img/blank.png';
import { formatDate } from '../../../utils/timeAndDate/formatDate';

import { useNavigate } from 'react-router-dom';
function NewsCard({ data, isExpended = false }) {
	const navigate = useNavigate();
	const handleRedirect = id => {
		navigate(`/news/${id}`);
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
				{isExpended && (
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
				)}

				<CardContent>
					<Stack
						direction={'column'}
						spacing={1.5}
						flexGrow={1}
						sx={{ marginTop: '5px' }}
					>
						<Typography level='body-md'>
							{formatDate(data.created_at, true)}
						</Typography>
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
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}
export default NewsCard;
