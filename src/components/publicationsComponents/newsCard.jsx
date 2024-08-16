import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPastelDominantColor } from '../../utils/colors/getPastelDominantColor';
import Box from '@mui/joy/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ProfileBlank from '../../img/profileBlank.png';
import { timeAgo } from '../../utils/timeAndDate/timeAgo';

const NewsCard = ({ data }) => {
	const navigate = useNavigate();
	// const [pastelColor, setPastelColor] = useState('#ffffff');

	// useEffect(() => {
	// 	async function fetchPastelColor() {
	// 		const color = await getPastelDominantColor(img);
	// 		setPastelColor(color);
	// 	}

	// 	fetchPastelColor();
	// }, [img]);

	const handleRedirect = id => {
		navigate(`/news/${id}`);
	};
	return (
		<Card
			variant='plain'
			sx={{
				display: 'flex',
				padding: '15px',
				cursor: 'pointer',
				'--Card-radius': '30px',
				// maxWidth: '425px',
				// maxHeight: '450px',
				flexGrow: '1',
				overflow: 'hidden',
				height: '100%',
				'&:hover .cover': {
					transform: 'scale(1.075)',
				},
				gap: '0',
			}}
			onClick={() => handleRedirect(data.id)}
		>
			<CardOverflow>
				<AspectRatio
					minHeight='250px'
					maxHeight='250px'
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
						src={data.cover_uri}
						alt={data.title}
						loading='lazy'
					/>
				</AspectRatio>
			</CardOverflow>
			<Stack direction='column' flexGrow={'1'} justifyContent='space-between'>
				<Stack paddingTop={'20px'} direction='column' flexGrow={1}>
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
						<Typography
							level='title-lg'
							fontWeight={'700'}
							fontSize={'clamp(0.9rem,3vw, 1.35rem)'}
						>
							{data.title}
						</Typography>
					</Box>
					<Stack
						sx={{
							paddingTop: '10px',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							whiteSpace: 'normal',
						}}
					>
						<Typography
							level='body-md'
							fontSize={'clamp(0.8rem,2.9vw, 1.1rem)'}
						>
							{data.description && data.description.desc}
						</Typography>
					</Stack>
				</Stack>
				<Stack
					paddingTop={'20px'}
					direction='row'
					alignItems='center'
					gap='15px'
				>
					<Avatar
						alt={data.nickname}
						src={data.profile_image_uri ? data.profile_image_uri : ProfileBlank}
						sx={{
							'--Avatar-size': '44px',
						}}
					/>
					<Stack
						direction='column'
						justifyContent={'space-between'}
						flexGrow={1}
					>
						<Typography
							level='body-md'
							fontSize={'clamp(0.8rem,2.5vw, 1.1rem)'}
							fontWeight={'500'}
						>
							{data.nickname}
						</Typography>
						<Stack
							direction='row'
							justifyContent={'space-between'}
							flexGrow={1}
						>
							<Stack direction='row' alignItems={'center'} gap='4px'>
								<VisibilityIcon sx={{ fontSize: 17, paddingBottom: '' }} />
								<Typography level='title-sm'>{data.views}</Typography>
							</Stack>
							<Typography
								level='body-md'
								fontSize={'clamp(0.7rem,2vw, 0.9rem)'}
							>
								{timeAgo(data.created_at)}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Card>
	);
};

export default NewsCard;
