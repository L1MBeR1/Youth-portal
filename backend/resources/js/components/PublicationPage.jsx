import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogDetail from './BlogDetail';

const APITestPage = () => {
    const [url, setUrl] = useState('http://127.0.0.1:8000/api/blogs');
    const [method, setMethod] = useState('GET');
    const [token, setToken] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
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

    const handleBlogClick = (blog) => {
        setSelectedBlog(blog);
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

            {!selectedBlog && blogs.map((blog) => (
                <div key={blog.id} className="blog-summary" onClick={() => handleBlogClick(blog)}>
                    <h2>{blog.title}</h2>
                    <p>{blog.excerpt}</p>
                </div>
            ))}

            {selectedBlog && <BlogDetail blog={selectedBlog} token={token} onClose={() => setSelectedBlog(null)} />}
        </div>
    );
};

export default APITestPage;
