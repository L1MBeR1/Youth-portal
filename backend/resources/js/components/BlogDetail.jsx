import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BlogDetail = ({ blog, token, onClose }) => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/blogs/${blog.id}/comments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setComments(response.data.data);
            } catch (error) {
                setError('Error fetching comments');
            }
        };

        fetchComments();
    }, [blog.id, token]);

    return (
        <div className="blog-detail">
            <button onClick={onClose} className="close-button">Close</button>
            <h1>{blog.title}</h1>
            <div className="blog-meta">
                <div className="blog-author">
                    <img className="avatar" src="/placeholder-user.jpg" alt="User" />
                    <span>{blog.authorName}</span>
                </div>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <p>{blog.content}</p>

            <div className="comments">
                <h2>Comments</h2>
                {error && <p className="error">{error}</p>}
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <div className="comment-author">
                            <img className="avatar" src="/placeholder-user.jpg" alt="User" />
                            <div>
                                <span>{comment.userName}</span>
                                <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogDetail;
