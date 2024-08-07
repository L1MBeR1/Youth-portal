import React, { useState } from 'react';

import { timeAgo } from '../../utils/timeAndDate/timeAgo';
import { useNavigate } from 'react-router-dom';
import { CommentReplyInput } from './commentReplyInput';

import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import { likeTheComment } from '../../api/commentsApi';
import { getToken } from '../../utils/authUtils/tokenStorage';
export const Comment = ({ comment, resourceType, resourceId, refetch }) => {
	const navigate = useNavigate();
	const [openInput, setOpenInput] = useState(false);
	const [isLiked, setIsLiked] = useState(comment.is_liked);
	const [likesCounter, setLikesCounter] = useState(comment.likes);

	const handelOpenInput = () => {
		setOpenInput(!openInput);
	};
	const handleLikeTheComment = async () => {
		const { token, needsRedirect } = await getToken();
		if (needsRedirect) {
			navigate('/login');
		}
		setIsLiked(!isLiked);
		setLikesCounter(isLiked ? likesCounter - 1 : likesCounter + 1);

		// console.log(token, id);
		const response = await likeTheComment(token, comment.id);
		if (response) {
			console.log(response);
		} else {
			setIsLiked(!isLiked);
			setLikesCounter(comment.likes);
		}
	};
	return (
		<Sheet
			sx={{
				width: '100%',
			}}
		>
			<Stack
				direction='row'
				justifyContent='flex-start'
				alignItems='flex-start'
				spacing={2}
			>
				<Avatar
					src={comment.profile_image_uri}
					alt={comment.nickname}
					variant='outlined'
					size='md'
				/>
				<Stack
					direction={'column'}
					spacing={0.5}
					sx={{
						flexGrow: 1,
					}}
				>
					<Stack
						direction='row'
						justifyContent='flex-start'
						alignItems='center'
						spacing={1}
					>
						<Typography level='title-md'>
							{comment.first_name} {comment.last_name} ({comment.nickname})
						</Typography>
						<Typography level='body-xs'>
							{timeAgo(comment.created_at)}
						</Typography>
					</Stack>
					{comment.parentName ? (
						<Typography level='body-md'>
							{comment.parentName + ', ' + comment.content}
						</Typography>
					) : (
						<Typography level='body-md'>{comment.content}</Typography>
					)}
					<Stack
						direction='row'
						justifyContent='flex-start'
						alignItems='center'
						spacing={1}
						sx={{
							marginLeft: '-10px',
						}}
					>
						<Button
							variant='plain'
							color='neutral'
							size='sm'
							sx={{
								borderRadius: '40px',
							}}
							onClick={handelOpenInput}
						>
							{openInput ? 'Отмена' : 'Ответить'}
						</Button>

						<Button
							variant={isLiked ? 'soft' : 'plain'}
							color={isLiked ? 'success' : 'neutral'}
							size='sm'
							sx={{
								borderRadius: '50px',
								'--Button-gap': '5px',
							}}
							startDecorator={<ThumbUpOffAltIcon />}
							onClick={handleLikeTheComment}
						>
							<Typography
								fontSize='12px'
								color={isLiked ? 'success' : 'neutral'}
							>
								{likesCounter}
							</Typography>
						</Button>
					</Stack>
					{openInput && (
						<CommentReplyInput
							replyTo={comment.id}
							resourceId={resourceId}
							resourceType={resourceType}
							refetch={refetch}
						/>
					)}
				</Stack>
			</Stack>
		</Sheet>
	);
};
