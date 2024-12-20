import React, { useState } from 'react';

import FlagIcon from '@mui/icons-material/Flag';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/timeAndDate/timeAgo';
import { CommentInput } from './commentInput';

import { IconButton } from '@mui/joy';
import { likeTheComment } from '../../api/commentsApi';
import { getToken } from '../../utils/authUtils/tokenStorage';
import ReportResourceModal from '../modals/reportResourceModal';
export const Comment = ({
	comment,
	resourceType,
	resourceId,
	refetch,
	profileData,
}) => {
	const navigate = useNavigate();
	const [openInput, setOpenInput] = useState(false);
	const [reportModalOpen, setReportModalOpen] = useState(false);
	const [isLiked, setIsLiked] = useState(comment.is_liked);
	const [likesCounter, setLikesCounter] = useState(comment.likes);

	const handleOpenInput = () => {
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
		<>
			<ReportResourceModal
				id={comment.id}
				resourceType={'comment'}
				setOpen={setReportModalOpen}
				open={reportModalOpen}
			/>
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
								{comment.nickname}
							</Typography>
							<Typography
								level='body-xs'
								fontSize={'clamp(0.69rem,2vw, 0.8rem)'}
							>
								{timeAgo(comment.created_at)}
							</Typography>
						</Stack>
						<Box
							sx={{ wordWrap: 'break-word', maxWidth: '100%', hyphens: 'auto' }}
						>
							{comment.parent ? (
								<Typography
									level='body-md'
									fontSize={'clamp(0.85rem,3vw, 1rem)'}
								>
									{comment.parent.name + ', ' + cleanAllTags(comment.content)}
								</Typography>
							) : (
								<Typography
									level='body-md'
									fontSize={'clamp(0.85rem,3vw, 1rem)'}
								>
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
								onClick={handleOpenInput}
							>
								{openInput ? 'Отмена' : 'Ответить'}
							</Button>

							<Button
								variant={isLiked ? 'soft' : 'plain'}
								color={isLiked ? 'primary' : 'neutral'}
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
									color={isLiked ? 'primary' : 'neutral'}
								>
									{likesCounter}
								</Typography>
							</Button>

							<IconButton
								variant='plain'
								color='neutral'
								size='sm'
								disabled={!profileData}
								onClick={() => {
									setReportModalOpen(true);
								}}
							>
								<FlagIcon />
							</IconButton>
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
		</>
	);
};
