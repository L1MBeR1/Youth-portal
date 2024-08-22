import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlog } from '../api/blogsApi.js';
import { formatDate } from '../utils/timeAndDate/formatDate.js';

import useEventById from '../hooks/useEventById.js';

import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';

import VisibilityIcon from '@mui/icons-material/Visibility';

import DOMPurify from 'dompurify';

import EventMap from '../components/maps/eventMap.jsx';
import { getBackgroundColor } from '../utils/colors/getBackgroundColor.js';
function EventPage() {
	const { id } = useParams();
	const { data, isFetching } = useEventById(id);

	console.log(data);
	const [pastelColor, setPastelColor] = useState('#ffffff');

	useEffect(() => {
		async function fetchPastelColor() {
			const color = await getBackgroundColor(data.cover_uri);
			setPastelColor(color);
		}
		if (data) {
			fetchPastelColor();
		}
	}, [data]);
	const createMarkup = html => {
		return { __html: DOMPurify.sanitize(html) };
	};
	return (
		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				paddingX: {
					xs: '15px',
					sm: '40px',
				},
			}}
		>
			{isFetching || !data ? (
				<></>
			) : (
				<Card
					variant='plain'
					sx={{
						marginTop: '40px',
						'--Card-radius': '30px',
						p: '25px',
					}}
				>
					<CardOverflow>
						<Card
							variant='plain'
							sx={{
								width: '100%',
								height: '500px',
								borderRadius: '30px',
							}}
						>
							<CardCover>
								<img src={data.cover_uri} alt={data.title} />
							</CardCover>
							<CardContent>
								<Typography level='publications-h1'>{data.title}</Typography>
							</CardContent>
						</Card>
					</CardOverflow>
					<Stack
						direction={'column'}
						spacing={4}
						sx={{
							marginTop: '4vh',
						}}
					>
						<Stack marginTop={2} direction={'row'}>
							<Stack direction={'column'} spacing={1} flexGrow={1}>
								<Typography level='publications-h2'>О мероприятии</Typography>
							</Stack>
							<Stack
								direction={'column'}
								spacing={1}
								flexGrow={1}
								maxWidth={'50%'}
							>
								<Typography level='body-lg'>{data.description}</Typography>
							</Stack>
						</Stack>
						<Stack
							direction={'row'}
							sx={{
								height: '60vh',
							}}
						>
							<Stack direction={'column'} spacing={1} flexGrow={1}>
								<Typography level='publications-h2'>Адрес</Typography>
							</Stack>
							<Stack
								direction={'column'}
								spacing={1}
								flexGrow={1}
								maxWidth={'50%'}
							>
								<Box
									sx={{
										borderRadius: '30px',
										overflow: 'hidden',
										height: '100%',
									}}
								>
									<EventMap data={data} />
								</Box>
								<Typography level='body-lg'>{`${data.address.country}, ${data.address.city}, ${data.address.street}, ${data.address.house}`}</Typography>
							</Stack>
						</Stack>
						<Stack direction={'row'}>
							<Stack direction={'column'} spacing={1} flexGrow={1}>
								<Typography level='publications-h2'>Проект</Typography>
							</Stack>
							<Stack
								direction={'column'}
								spacing={1}
								flexGrow={1}
								marginTop={'15px'}
								maxWidth={'50%'}
							></Stack>
						</Stack>
					</Stack>
				</Card>
			)}
		</Box>
	);
}

export default EventPage;
