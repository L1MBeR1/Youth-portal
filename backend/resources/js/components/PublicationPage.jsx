import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/app.css';

const APITestPage = () => {
    const [url, setUrl] = useState('http://127.0.0.1:8000/api/blogs');
    const [method, setMethod] = useState('GET');
    const [token, setToken] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            const fetchBlogs = async () => {
                try {
                    const response = await axios({
                        method: method,
                        url: url,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setBlogs(response.data.data);
                } catch (error) {
                    setError('Error fetching blogs');
                }
            };

            fetchBlogs();
        }
    }, [url, method, token]);

    const fetchComments = async (blogId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/blogs/${blogId}/comments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setComments(response.data.data);
        } catch (error) {
            setError('Error fetching comments');
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="url">API URL:</label>
                        <input
                            type="text"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="method">Method:</label>
                        <select
                            id="method"
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                        >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="token">Bearer Token:</label>
                        <input
                            type="text"
                            id="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            {error && <p className="error">{error}</p>}

            {blogs.map((blog) => (
                <article className="blog" key={blog.id}>
                    <div className="blog-header">
                        <h1>{blog.title}</h1>
                        <div className="blog-meta">
                            <div className="blog-author">
                                <span>{blog.authorName}</span>
                            </div>
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <p>{blog.content}</p>
                    <button className="show-comments" onClick={() => fetchComments(blog.id)}>
                        Show Comments
                    </button>

                    <div className="comments">
                        <h2>Comments</h2>
                        {comments.filter(comment => comment.blog_id === blog.id).map((comment) => (
                            <div className="comment" key={comment.id}>
                                <div className="comment-author">
                                     
                                    <div>
                                        <span>{comment.userName}</span>
                                        <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <p>{comment.content}</p>
                                <div className="comment-actions">
                                    <button className="reply">Reply</button>
                                    <button className="like">Like</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>
            ))}
        </div>
    );
};

export default APITestPage;
