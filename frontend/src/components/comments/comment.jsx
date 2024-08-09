import React, { useState } from 'react';

import { timeAgo } from '../../utils/timeAndDate/timeAgo';
import { useNavigate, Link } from 'react-router-dom';
import { CommentInput } from './commentInput';
import DOMPurify from 'dompurify';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import { likeTheComment } from '../../api/commentsApi';
import { getToken } from '../../utils/authUtils/tokenStorage';
export const Comment = ({
	comment,
	resourceType,
	resourceId,
	refetch,
	profileData,
}) => {
	const navigate = useNavigate();
	const [openInput, setOpenInput] = useState(false);
	const [isLiked, setIsLiked] = useState(comment.is_liked);
	const [likesCounter, setLikesCounter] = useState(comment.likes);

	const handelOpenInput = () => {
		setOpenInput(!openInput);
	};
	function cleanAllTags(dirtyHTML) {
		console.log('sanitize');
		return DOMPurify.sanitize(dirtyHTML, {
			ALLOWED_TAGS: [],
			KEEP_CONTENT: true,
		});
	}
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
	const handleToProfile = id => {
		navigate(`/profile/${id}`);
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
					sx={{
						cursor: 'pointer',
					}}
					onClick={() => {
						handleToProfile(comment.user_id);
					}}
				/>
				<Stack
					direction={'column'}
					spacing={0.5}
					sx={{
						maxWidth: 'calc(100% - 40px - 16px)',
						flexGrow: 1,
					}}
				>
					<Stack
						direction='row'
						justifyContent='flex-start'
						alignItems='center'
						spacing={1}
					>
						<Typography
							fontSize={'clamp(0.85rem,3vw, 1rem)'}
							level='title-md'
							sx={{
								cursor: 'pointer',
							}}
							onClick={() => {
								handleToProfile(comment.user_id);
							}}
						>
							{comment.first_name} {comment.last_name} ({comment.nickname})
						</Typography>
						<Typography level='body-xs' fontSize={'clamp(0.69rem,2vw, 0.8rem)'}>
							{timeAgo(comment.created_at)}
						</Typography>
					</Stack>
					<Box
						sx={{ wordWrap: 'break-word', maxWidth: '100%', hyphens: 'auto' }}
					>
						{comment.parent ? (
							<Typography level='body-md' fontSize={'clamp(0.85rem,3vw, 1rem)'}>
								{comment.parent.name + ', ' + cleanAllTags(comment.content)}
							</Typography>
						) : (
							<Typography level='body-md' fontSize={'clamp(0.85rem,3vw, 1rem)'}>
								{cleanAllTags(comment.content)}
							</Typography>
						)}
					</Box>
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
								fontSize: 'clamp(0.8rem,3vw, 1rem)',
							}}
							disabled={profileData ? false : true}
							onClick={handelOpenInput}
						>
							{openInput ? 'Отмена' : 'Ответить'}
						</Button>

						<Button
							variant={isLiked ? 'soft' : 'plain'}
							color={isLiked ? 'success' : 'neutral'}
							size='sm'
							disabled={profileData ? false : true}
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
						<CommentInput
							replyTo={comment.id}
							resourceId={resourceId}
							resourceType={resourceType}
							refresh={refetch}
							profileData={profileData}
						/>
					)}
				</Stack>
			</Stack>
		</Sheet>
	);
};
