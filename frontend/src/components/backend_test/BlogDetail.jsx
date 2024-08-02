import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Card, CardContent, CardActions, IconButton, Button, Input } from '@mui/joy';
import { ThumbUpAltOutlined as ThumbUpIcon } from '@mui/icons-material';
import { getCommentsForResource, postComment } from '../../api/commentsApi.js';
import { getToken } from '../../utils/authUtils/tokenStorage.js';
import { getBlogsByPage} from '../../api/blogsApi.js';

function Comment({ comment, allComments }) {
    const getReplies = (commentId) => {
        return allComments.filter(c => c.reply_to === commentId);
    };

    const renderReplies = (commentId) => {
        const replies = getReplies(commentId);
        return replies.length > 0 && (
            <Box sx={{ ml: 3 }}>
                {replies.map(reply => (
                    <Comment key={reply.id} comment={reply} allComments={allComments} />
                ))}
            </Box>
        );
    };

    return (
        <Card variant="outlined" sx={{ mb: 2, borderRadius: 'md' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={comment.profile_image_uri} alt={comment.nickname} sx={{ width: 50, height: 50, mr: 2 }} />
                    <Box>
                        <Typography level="body1" fontWeight="bold">
                            {comment.first_name} {comment.last_name} ({comment.nickname})
                        </Typography>
                        <Typography level="body2" color="text.secondary">{comment.content}</Typography>
                        <Typography level="caption" color="text.secondary">{new Date(comment.created_at).toLocaleString()}</Typography>
                    </Box>
                </Box>
                <CardActions>
                    <IconButton>
                        <ThumbUpIcon />
                    </IconButton>
                    <Typography level="body2" sx={{ ml: 1 }}>Likes: {comment.likes}</Typography>
                </CardActions>
            </CardContent>
            {renderReplies(comment.id)}
        </Card>
    );
}


function BlogDetail() {
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const {token} = await getToken()
                const res = await getBlogsByPage(token, { blogId: 12 });
                setBlog(res.data[0]);
                console.log('DATA', res.data);
            } catch (error) {
                console.error('Error fetching blog details:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const {token} = await getToken()
                const res = await getCommentsForResource(token, 'blog', 12);
                console.log('COMMENTS', res.data);
                setComments(res.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchBlog();
        fetchComments();
    }, []);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return; // Не отправлять пустой комментарий

        setIsSubmitting(true);
        try {
            const {token} = await getToken()
            const res = await postComment(token, 'blog', 12, { content: newComment });
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!blog) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography level="h1" gutterBottom>{blog.title}</Typography>
            <Box component="img" src={blog.cover_uri} alt={blog.title} sx={{ width: '100%', height: 'auto', borderRadius: 'md' }} />
            <Typography level="body1" sx={{ mt: 2 }}>{blog.description.desc}</Typography>
            <Box sx={{ mt: 2 }}>
                <Typography level="h2" gutterBottom>Comments</Typography>
                {comments.filter(comment => !comment.reply_to).map(comment => (
                    <Comment key={comment.id} comment={comment} allComments={comments} />
                ))}
                <Box sx={{ mt: 3 }}>
                    <Input
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={handleCommentChange}
                        sx={{ width: '100%', mb: 2 }}
                        multiline
                        minRows={3}
                    />
                    <Button
                        onClick={handleCommentSubmit}
                        loading={isSubmitting}
                        variant="solid"
                        sx={{ display: 'block', mx: 'auto' }}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default BlogDetail;
