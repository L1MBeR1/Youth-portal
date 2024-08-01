import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePublicationById from "../hooks/usePublicationById.js";
import { getBlog } from "../api/blogsApi.js";
import { getCommentsForResource, postComment } from '../api/commentsApi.js'
import { getToken } from '../utils/authUtils/tokenStorage.js';

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";

import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";


import DOMPurify from 'dompurify';
import { CommentSection } from "../components/comments/commentsSection.jsx";


function Blogs() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const {data,isFetching,} = usePublicationById(["blog"], getBlog, id);
  console.log(data)

  useEffect(() => {

    const fetchComments = async () => {
        try {
            const {token} = await getToken()
            const res = await getCommentsForResource(token, 'blog', 12,{page:1});//TODO Заменить id
            console.log('COMMENTS', res.data);
            setComments(res.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    fetchComments();
}, []);
const createMarkup = (html) => {
  return { __html: DOMPurify.sanitize(html) };
};
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        marginX: { xs: "10px", md: "10%", lg: "15%" },
      }}
    >
      {" "}
      {isFetching ? (
        <></>
      ) : (
        <Card
          variant="plain"
          sx={{
            marginTop: "20px",
            "--Card-radius": "20px",
            p: 0,
          }}
        >
          <Stack spacing={3}>
            <AspectRatio maxHeight={"350px"}>
              <img src={data.cover_uri} alt={data.title} />
            </AspectRatio>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Typography level="h1">{data.title}</Typography>
            </Stack>
            <Box>
            <Typography
                level="body-lg"
              >
              <Box dangerouslySetInnerHTML={createMarkup(data.content)}/>
              </Typography>
            </Box>
            <Stack>
            <Box sx={{ mt: 2 }}>
                <Typography level="h2" gutterBottom>Comments</Typography>
                <CommentSection data={comments}/>
            </Box>
            </Stack>
          </Stack>
        </Card>
      )}
    </Box>
  );
}

export default Blogs;
