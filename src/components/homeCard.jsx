import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/joy/Box';
import CallMadeIcon from '@mui/icons-material/CallMade';
import { isAscii } from 'validator';
const HomeCard = ({ title, category, img, isSmall }) => {
	return (
		<Card
			variant='plain'
			sx={{ width: '100%', flexGrow: 1, borderRadius: '60px', padding: '40px' }}
		>
			<CardCover>
				<img src={img} loading='lazy' alt='' />
			</CardCover>
			<CardContent>
				<Stack
					direction={'column'}
					flexGrow={1}
					justifyContent={'space-between'}
				>
					<Stack>
						<Stack
							sx={{
								padding: '12px 20px',
								outline: '1px solid white',
								maxWidth: 'fit-content',
								borderRadius: '50px',
							}}
						>
							<Typography
								textColor='white'
								fontSize={'clamp(0.75rem,1vw, 1.3rem)'}
								fontWeight={'700'}
							>
								{category}
							</Typography>
						</Stack>
					</Stack>
					<Stack
						direction={'row'}
						width={'100%'}
						justifyContent={'space-between'}
					>
						{isSmall ? (
							<Typography
								textColor='white'
								fontSize={'clamp(1.5rem,2vw, 2rem)'}
								fontWeight={'700'}
								lineHeight={'1.2'}
							>
								{title}
							</Typography>
						) : (
							<Typography
								textColor='white'
								fontSize={'clamp(1.5rem,4vw, 3rem)'}
								fontWeight={'700'}
								lineHeight={'1.2'}
							>
								{title}
							</Typography>
						)}
						<Stack justifyContent={'flex-end'} paddingBottom={'17px'}>
							<Stack
								sx={{
									padding: '12px 20px',
									backgroundColor: 'white',
									borderRadius: '50px',
								}}
							>
								{isSmall ? (
									<CallMadeIcon />
								) : (
									<Typography
										fontSize={'clamp(0.75rem,1vw, 1.3rem)'}
										fontWeight={'700'}
									>
										Подробнее
									</Typography>
								)}
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default HomeCard;
