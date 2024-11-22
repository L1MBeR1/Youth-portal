import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardCover from '@mui/joy/CardCover';
import CardOverflow from '@mui/joy/CardOverflow';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import DOMPurify from 'dompurify';
import React from 'react';
import { useParams } from 'react-router-dom';
import EventMap from '../components/maps/eventMap.jsx';
import useEventById from '../hooks/useEventById.js';
import { formatDate } from '../utils/timeAndDate/formatDate.js';

import EventIcon from '@mui/icons-material/Event';
import RoomIcon from '@mui/icons-material/Room';
import { Avatar } from '@mui/joy';
import { mainMargin } from '../themes/margins.js';

function EventPage() {
	const { id } = useParams();
	const { data, isFetching } = useEventById(id);
	// const [pastelColor, setPastelColor] = useState('#ffffff');

	// useEffect(() => {
	// 	async function fetchPastelColor() {
	// 		const color = await getBackgroundColor(data.cover_uri);
	// 		setPastelColor(color);
	// 	}
	// 	if (data) {
	// 		fetchPastelColor();
	// 	}
	// }, [data]);

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
				marginX: mainMargin,
			}}
		>
			{isFetching || !data ? (
				<></>
			) : (
				<Card
					variant='plain'
					sx={{
						marginTop: '40px',
						borderRadius: '30px',
						p: '25px',
						overflow: 'hidden',
					}}
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
								height: '450px',
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
								<Box
									sx={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: '100%',
										backgroundColor: 'rgba(12, 16, 24, 0.4)',
										zIndex: 1,
									}}
								/>
							</CardCover>
							<CardContent
								sx={{
									p: '40px 25px',
								}}
							>
								<Box
									sx={{
										display: 'grid',
										gridTemplateColumns: '1fr',
										rowGap: '24px',
										flexGrow: 1,
										justifyContent: 'flex-end',
									}}
								>
									{data.project && (
										<Stack direction='row' spacing={2} alignItems={'center'}>
											<Avatar
												variant='outlined'
												size='lg'
												src={data.project.cover_uri}
												alt={data.project.name}
											/>
											<Box>
												<Typography
													level='title-md'
													sx={{ color: 'var(--joy-staticColors-mainLight)' }}
												>
													{data.project.name}
												</Typography>
											</Box>
										</Stack>
									)}

									<Box>
										<Typography level='publications-h1-white'>
											{data.title}
										</Typography>
									</Box>

									<Box
										sx={{
											display: 'flex',
											alignItems: { xs: 'flex-start', md: 'flex-end' },
											gap: { xs: '10px', md: '20px' },
											flexDirection: { xs: 'column', md: 'row' },
										}}
									>
										<Stack direction={'row'} spacing={1} alignItems={'center'}>
											<EventIcon
												sx={{
													color: 'var(--joy-staticColors-mainLight)',
													fontSize: '22px',
												}}
											/>
											<Typography
												level='title-md'
												sx={{ color: 'var(--joy-staticColors-mainLight)' }}
											>
												{formatDate(data.start_time, true)}
											</Typography>
										</Stack>
										<Stack direction={'row'} spacing={1} alignItems={'center'}>
											<RoomIcon
												sx={{
													color: 'var(--joy-staticColors-mainLight)',
													fontSize: '22px',
												}}
											/>
											<Typography
												level='title-md'
												sx={{ color: 'var(--joy-staticColors-mainLight)' }}
											>
												{`${data.address.country}, ${data.address.city}, ${data.address.street}, ${data.address.house}`}
											</Typography>
										</Stack>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</CardOverflow>
					<Stack
						direction={'column'}
						spacing={6}
						sx={{
							marginTop: '4vh',
						}}
					>
						<Stack
							marginTop={2}
							direction={{ xs: 'column', md: 'row' }}
							spacing={1}
						>
							<Stack
								direction={{ xs: 'row', md: 'column' }}
								spacing={1}
								flexGrow={1}
							>
								<Typography level='publications-h2'>О мероприятии</Typography>
							</Stack>
							<Stack
								direction={'column'}
								spacing={1}
								flexGrow={1}
								maxWidth={{ xs: '100%', md: '50%' }}
								sx={{ paddingTop: '15px' }}
							>
								<Typography level='body-lg'>
									<Box
										dangerouslySetInnerHTML={createMarkup(data.description)}
									/>
								</Typography>
							</Stack>
						</Stack>
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
							<Stack
								direction={{ xs: 'row', md: 'column' }}
								spacing={1}
								flexGrow={1}
							>
								<Typography level='publications-h2'>Адрес</Typography>
							</Stack>
							<Stack
								direction={'column'}
								spacing={1}
								flexGrow={1}
								maxWidth={{ xs: '100%', md: '50%' }}
							>
								<Box
									sx={{
										borderRadius: '30px',
										overflow: 'hidden',
										height: '50vh',
									}}
								>
									<EventMap data={data} zoom={10} />
								</Box>
								<Typography level='body-lg'>{`${data.address.country}, ${data.address.city}, ${data.address.street}, ${data.address.house}`}</Typography>
							</Stack>
						</Stack>
						{/* <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
							<Stack
								direction={{ xs: 'row', md: 'column' }}
								spacing={1}
								flexGrow={1}
							>
								<Typography level='publications-h2'>Проект</Typography>
							</Stack>
							<Stack
								direction={{ xs: 'row', md: 'column' }}
								spacing={1}
								flexGrow={1}
								marginTop={'15px'}
								maxWidth={{ xs: '100%', md: '50%' }}
							></Stack>
						</Stack> */}
					</Stack>
				</Card>
			)}
		</Box>
	);
}

export default EventPage;
