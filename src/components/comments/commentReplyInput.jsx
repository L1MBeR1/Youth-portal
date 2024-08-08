import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Textarea from '@mui/joy/Textarea';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import DOMPurify from 'dompurify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { postReplyComment } from '../../api/commentsApi';
import useProfile from '../../hooks/useProfile';
import { getToken } from '../../utils/authUtils/tokenStorage';
import EmojiPicker from '../common/emojiPicker';
export const CommentReplyInput = ({
	resourceType,
	resourceId,
	refetch,
	replyTo,
}) => {
	const { data: profileData } = useProfile();
	const [comment, setComment] = useState('');
	const [moveButtonDown, setMoveButtonDown] = useState(false);
	const navigate = useNavigate();

	const handleEmojiSelect = emoji => {
		setComment(prevComment => prevComment + emoji);
	};
	const handleInputChange = e => {
		const value = e.target.value;
		setComment(value);
		setMoveButtonDown(value.length > 15);
	};

	const handleSubmit = async () => {
		const sanitizedComment = DOMPurify.sanitize(comment);
		console.log(sanitizedComment);
		const { token, needsRedirect } = await getToken();
		if (needsRedirect) {
			navigate('/login');
		}
		const response = await postReplyComment(
			token,
			resourceType,
			resourceId,
			sanitizedComment,
			replyTo
		);
		if (response) {
			refetch();
			setComment('');
			console.log(response);
		}
	};

	return (
		<>
			{profileData ? (
				<Stack
					direction='row'
					spacing={2}
					sx={{
						marginTop: '10px',
						flexGrow: 1,
					}}
				>
					<Avatar
						src={profileData.profile_image_uri}
						alt={profileData.nickname}
						variant='outlined'
						size='md'
					/>
					<Sheet
						sx={{
							position: 'relative',
							width: '100%',
							outline: '1px solid black',
							borderRadius: '20px',
							display: 'flex',
							flexDirection: 'column',
							padding: '10px 20px',
							paddingLeft: '20px',
						}}
					>
						<Textarea
							minRows={1}
							placeholder='Введите комментарий'
							value={comment}
							onChange={handleInputChange}
							variant='plain'
							sx={{
								'--Textarea-focusedThickness': '0',
								resize: 'none',
								width: '100%',
								padding: '0',
								paddingTop: '7px',
								paddingBottom: moveButtonDown ? '50px' : '0',
								boxSizing: 'border-box',
							}}
						/>
						<Stack
							direction={'row'}
							spacing={1}
							sx={{
								position: 'absolute',
								right: '10px',
								bottom: '8px',
							}}
						>
							<EmojiPicker onSelect={handleEmojiSelect} />
							<IconButton
								size='lg'
								color='primary'
								variant='soft'
								onClick={handleSubmit}
								sx={{
									borderRadius: '50px',
								}}
							>
								<ArrowUpwardIcon />
							</IconButton>
						</Stack>
					</Sheet>
				</Stack>
			) : (
				<></>
			)}
		</>
	);
};
