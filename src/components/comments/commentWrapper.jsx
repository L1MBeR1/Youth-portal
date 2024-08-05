import React, { useEffect, useState } from 'react';
import { textDeclension } from '../../utils/textDeclension';
import { Comment } from './comment';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';

export const CommentWrapper = ({ comment }) => {
	const [openReplies, setOpenReplies] = useState(false);
	const [visibleComments, setVisibleComments] = useState(10);
	const [willVisibleComments, setWillVisibleComments] = useState(0);

	useEffect(() => {
		const remainingComments = comment.replies.length - visibleComments;
		if (remainingComments > 0) {
			setWillVisibleComments(remainingComments <= 15 ? remainingComments : 10);
		} else {
			setWillVisibleComments(0);
		}
	}, [visibleComments, comment.replies.length]);

	const loadMoreComments = () => {
		setVisibleComments(prev => {
			const remainingComments = comment.replies.length - prev;
			console.log(prev, remainingComments);
			if (remainingComments <= 0) {
				return prev;
			}
			return prev + (remainingComments <= 15 ? comment.replies.length : 10);
		});
	};

	const handleOpenReplies = () => {
		setOpenReplies(!openReplies);
	};

	const shouldShowLoadMore =
		openReplies && visibleComments < comment.replies.length;

	return (
		<>
			{comment.replies.length !== 0 ? (
				<Stack
					direction='column'
					justifyContent='flex-start'
					alignItems='flex-start'
					spacing={0.5}
				>
					<Comment comment={comment} />
					<Box sx={{ paddingLeft: '45px' }}>
						<Button
							variant='plain'
							size='sm'
							sx={{ borderRadius: '40px' }}
							onClick={handleOpenReplies}
						>
							{openReplies ? 'Скрыть' : 'Показать'}{' '}
							{textDeclension(
								comment.replies.length,
								'ответ',
								'ответа',
								'ответов'
							)}
						</Button>
					</Box>
					{openReplies && (
						<Stack
							sx={{
								width: '100%',
							}}
						>
							<Stack
								direction='column'
								justifyContent='flex-start'
								alignItems='flex-start'
								spacing={2}
								sx={{
									// margin: '10px 0 0 40px',
									boxSizing: 'border-box',
									paddingTop: '10px',
									paddingLeft: '70px',
									borderLeft: '1px solid',
									borderColor: 'divider',
									width: '100%',
								}}
							>
								{comment.replies.slice(0, visibleComments).map(comment => (
									<Comment key={comment.id} comment={comment} />
								))}
							</Stack>
							{shouldShowLoadMore && (
								<Box sx={{ paddingLeft: '55px' }}>
									<Button
										color='netral'
										variant='plain'
										size='sm'
										sx={{ borderRadius: '40px' }}
										onClick={loadMoreComments}
									>
										Показать ещё{' '}
										{textDeclension(
											willVisibleComments,
											'комментарий',
											'комментария',
											'комментариев'
										)}
									</Button>
								</Box>
							)}
						</Stack>
					)}
				</Stack>
			) : (
				<Comment comment={comment} />
			)}
		</>
	);
};
