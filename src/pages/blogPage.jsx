import React, { useEffect, useState } from 'react';
import { useNavigate,useParams  } from 'react-router-dom';
import Grid from '@mui/joy/Grid';
import usePublicationById from '../hooks/usePublicationById.js';
import { getBlog } from '../api/blogsApi.js';

import Box from '@mui/joy/Box';

import BlogCart from '../components/blogCard.jsx';
import Blank from '../img/blank.png'
import Pagination from '../components/workspaceComponents/shared/workSpacePagination.jsx';
function Blogs() {
    const { id } = useParams();
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();
  
    const { data: blogs, isLoading,refetch } = usePublicationById(['blog'],getBlog,id,setLastPage,);
    
      useEffect(() => {
        refetch();
      }, [page,refetch]);
  return (
    <Box
    sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow:1,
    marginX: { xs: '10px', md: '10%', lg: '15%' }
}}
    >
        
    </Box>
  );
}

export default Blogs;