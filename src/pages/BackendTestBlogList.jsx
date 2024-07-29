import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import Button from '@mui/joy/Button';
import { getBlogsActual } from '../api/blogsApi.js';
import { getCookie } from '../utils/cookie/cookieUtils.js';

function ContentGrid() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const fetchBlogs = async (page) => {
    try {
      const data = await getBlogsActual(getCookie('token'), {page: page});
      setBlogs(data.data);
      setTotalPages(data.message.last_page);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const openBlog = (blogId) => {
    navigate(`/bt/${blogId}`);
  };

  return (
    <div>
      <Grid container spacing={2}>
        {blogs.map((blog) => (
          <Grid item key={blog.id} xs={12} sm={6} md={4}>
            <Card variant="outlined" onClick={() => openBlog(blog.id)}>
              <img src={blog.cover_uri} alt={blog.title} style={{ width: '100%', height: 'auto' }} />
              <h2>{blog.title}</h2>
              <p>{blog.description.desc}</p>
              <Button onClick={() => openBlog(blog.id)}>Read More</Button>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default ContentGrid;
