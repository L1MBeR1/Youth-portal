import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCommentsForResource } from '../../api/commentsApi.js';

import { getCookie } from '../../cookie/cookieUtils.js';
import {  getBlogsActual } from '../../api/blogsApi.js';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogsActual(getCookie('token'), {blogId: id});
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog details:', error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <img src={blog.cover_uri} alt={blog.title} style={{ width: '100%', height: 'auto' }} />
      <p>{blog.description.desc}</p>
      <div>
        <h2>Comments</h2>
      </div>
    </div>
  );
}

export default BlogDetail;
