import React from 'react';

import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const PublicationStatistic = ({ id, likes, reposts, views }) => {
	return (
		<Sheet>
			<Stack direction={'row'} spacing={2}>
				<Stack direction={'row'} alignItems={'center'}>
					<IconButton size='lg'>
						<ThumbUpOffAltIcon />
					</IconButton>
					<Typography level='title-md'>{likes}</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'}>
					<IconButton size='lg'>
						<ReplyIcon sx={{ transform: 'rotateY(180deg)' }} />
					</IconButton>
					<Typography level='title-md'>{reposts}</Typography>
				</Stack>
				<Stack
					direction={'row'}
					alignItems={'center'}
					spacing={1}
					marginLeft={'1.5'}
				>
					<VisibilityIcon size='sm' />
					<Typography level='title-md'>{views}</Typography>
				</Stack>
			</Stack>
		</Sheet>
	);
};
