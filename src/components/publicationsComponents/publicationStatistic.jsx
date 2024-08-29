import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button } from '@mui/joy';
import { likeTheBlog } from '../../api/blogsApi';
import { getToken } from '../../utils/authUtils/tokenStorage';
export const PublicationStatistic = ({
	id,
	liked,
	likes,
	reposts,
	views,
	profileData,
}) => {
	const [isLiked, setIsLiked] = useState(liked);
	const [likesCounter, setLikesCounter] = useState(likes);
	const navigate = useNavigate();

	const handleLikeTheBlog = async () => {
		const { token, needsRedirect } = await getToken();
		if (needsRedirect) {
			navigate('/login');
		}
		setIsLiked(!isLiked);
		setLikesCounter(isLiked ? likesCounter - 1 : likesCounter + 1);

		// console.log(token, id);
		const response = await likeTheBlog(token, id);
		if (response) {
			console.log(response);
		} else {
			setIsLiked(!isLiked);
			setLikesCounter(likes);
		}
	};
	return (
		<Sheet>
			<Stack direction={'row'} spacing={2}>
				<Button
					variant={isLiked ? 'soft' : 'plain'}
					color={isLiked ? 'primary' : 'neutral'}
					sx={{
						borderRadius: '50px',
						'--Button-gap': '5px',
					}}
					startDecorator={<ThumbUpOffAltIcon />}
					onClick={handleLikeTheBlog}
					disabled={profileData ? false : true}
				>
					<Typography color={isLiked ? 'primary' : 'neutral'}>
						{likesCounter}
					</Typography>
				</Button>
				<Button
					variant='plain'
					color='neutral'
					sx={{
						borderRadius: '50px',
						'--Button-gap': '5px',
					}}
					startDecorator={<ReplyIcon />}
				>
					<Typography color='neutral'>{reposts}</Typography>
				</Button>
				<Stack
					direction={'row'}
					alignItems={'center'}
					spacing={1}
					marginLeft={'1.5'}
					padding={'6px 16px'}
				>
					<VisibilityIcon sx={{ fontSize: 18 }} />
					<Typography color='neutral'>{views}</Typography>
				</Stack>
			</Stack>
		</Sheet>
	);
};
