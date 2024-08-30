import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';
// import Textarea from '@mui/joy/Textarea';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { postComment, postReplyComment } from '../../api/commentsApi';
import { getToken } from '../../utils/authUtils/tokenStorage';

import EmojiPicker from '../common/emojiPicker';

export const CommentInput = ({
	resourceType,
	resourceId,
	refresh,
	replyTo,
	profileData,
}) => {
	const [comment, setComment] = useState('');

	const [moveButtonDown, setMoveButtonDown] = useState(false);
	const textareaRef = useRef(null);
	const navigate = useNavigate();

	const handleEmojiSelect = emoji => {
		setComment(prevComment => prevComment + emoji);
	};
	const handleInputChange = e => {
		const value = e.target.value;
		setComment(value);
		setMoveButtonDown(value.length > 15 || value.includes('\n'));
	};

	useEffect(() => {
		if (moveButtonDown) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		} else {
			textareaRef.current.style.height = 'auto';
		}
	}, [comment, moveButtonDown]);

	const handleSubmit = async () => {
		const sanitizedComment = DOMPurify.sanitize(comment);
		console.log(sanitizedComment);
		const { token, needsRedirect } = await getToken();
		if (needsRedirect) {
			navigate('/login');
		}
		let response;
		if (replyTo) {
			response = await postReplyComment(
				token,
				resourceType,
				resourceId,
				sanitizedComment,
				replyTo
			);
		} else {
			response = await postComment(
				token,
				resourceType,
				resourceId,
				sanitizedComment
			);
		}
		if (response) {
			refresh();
			setComment('');
			setMoveButtonDown(false);
			console.log(response);
		}
	};

	return (
		<>
			{profileData ? (
				<Stack
					direction='row'
					spacing={2}
					width='100%'
					sx={{ paddingBottom: '10px' }}
				>
					<Avatar
						src={profileData.profile_image_uri}
						alt={profileData.nickname}
						variant='outlined'
						sx={{
							'--Avatar-size': { xs: '40px', md: '60px' },
						}}
					/>
					<Sheet
						sx={{
							position: 'relative',
							width: '100%',
							outline: '1px solid black',
							borderRadius: '20px',
							display: 'flex',
							flexDirection: 'column',
							padding: { xs: '4px 20px', md: '12px 20px' },
						}}
					>
						<textarea
							placeholder='Введите комментарий'
							value={comment}
							onChange={handleInputChange}
							ref={textareaRef}
							style={{
								fontFamily: 'inter',
								fontSize: 'clamp(0.85rem, 3vw, 1rem)',
								resize: 'none',
								width: '100%',
								padding: '0',
								paddingTop: '7px',
								paddingBottom: moveButtonDown ? '50px' : '0',
								boxSizing: 'border-box',
								minHeight: '40px',
								border: 'none',
								outline: 'none',
								background: 'transparent',
								overflow: 'hidden',
							}}
							rows={1}
						/>
						<Stack
							direction={'row'}
							spacing={1}
							sx={{
								position: 'absolute',
								right: '10px',
								bottom: { xs: '5px', md: '8px' },
							}}
						>
							<Box
								sx={{
									display: { xs: 'none', md: 'flex' },
								}}
							>
								<EmojiPicker onSelect={handleEmojiSelect} />
							</Box>
							<IconButton
								color='primary'
								variant='soft'
								onClick={handleSubmit}
								disabled={comment.length < 1 && true}
								sx={{
									paddingX: { xs: '6px', md: '8px' },
									'--IconButton-size': { xs: '30px', md: '45px' },
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
