import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';

import DOMPurify from 'dompurify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { postComment } from '../../api/commentsApi';
import useProfile from '../../hooks/useProfile';
import { getToken } from '../../utils/authUtils/tokenStorage';

export const CommentReplyInput = ({ resourceType, resourceId, refresh }) => {
	const { data: profileData } = useProfile();
	const [comment, setComment] = useState('');
	const navigate = useNavigate();

	const handleInputChange = e => {
		setComment(e.target.value);
	};

	const handleSubmit = async () => {
		const sanitizedComment = DOMPurify.sanitize(comment);
		console.log(sanitizedComment);
		const { token, needsRedirect } = await getToken();
		if (needsRedirect) {
			navigate('/login');
		}
		const response = await postComment(
			token,
			resourceType,
			resourceId,
			sanitizedComment
		);
		if (response) {
			refresh();
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
					<Input
						placeholder='Введите комментарий'
						value={comment}
						onChange={handleInputChange}
						size='sm'
						sx={{
							flexGrow: 1,
							'--Input-minHeight': '40px',
							'--Input-paddingInline': '20px',
							'--Input-radius': '50px',
						}}
						endDecorator={
							<IconButton
								size='sm'
								color='primary'
								variant='soft'
								onClick={handleSubmit}
							>
								<ArrowUpwardIcon />
							</IconButton>
						}
					/>
				</Stack>
			) : (
				<></>
			)}
		</>
	);
};
