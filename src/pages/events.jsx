import React, { useEffect, useState } from 'react';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { Typography, Stack } from '@mui/joy';

import Map from '../components/map/map';
import EventCard from '../components/homeComponents/eventContainer/eventCard';
import useHomeEvents from '../hooks/useHomeEvents';
function Events() {
	const { data: events, isLoading } = useHomeEvents();
	return (
		<Stack
			direction={'column'}
			sx={{
				gap: '30px',
				padding: { xs: '15px', sm: '40px' },
			}}
		>
			<Box marginTop={{ xs: '15px', md: '25px' }}>
				<Typography level='h1' fontSize={'clamp(3rem,4vw, 5.5rem)'}>
					Мероприятия
				</Typography>
			</Box>
			<Stack direction={'column'}>
				{/* <Stack direction={'row'}>
					<Select></Select>
				</Stack> */}
				<Stack
					direction={'row'}
					height={'75vh'}
					sx={{
						borderRadius: '30px',
						overflow: 'hidden',
					}}
				>
					{!isLoading && (
						<>
							<Stack
								direction={'column'}
								flexGrow={1}
								sx={{
									maxWidth: '50%',
								}}
							>
								<Stack
									flexGrow={1}
									sx={{
										paddingRight: '20px',
										overflowY: 'scroll',
									}}
								>
									<Grid container spacing={2}>
										{events.map((event, index) => (
											<Grid
												item
												xs={12}
												smx={6}
												mdx={6}
												lgx={4}
												xxl={6}
												key={event.id}
											>
												<EventCard key={index} data={event} />
											</Grid>
										))}
									</Grid>
								</Stack>
							</Stack>
							<Stack direction={'column'} flexGrow={1}>
								<Map markers={events} />
							</Stack>
						</>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Events;
