import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import Skeleton from '@mui/joy/Skeleton';

import Box from "@mui/joy/Box";
import ProfileBlank from "../img/profileBlank.png";


const BlogCart = ({id, title, description, img, avatar, creator, createDate }) => {
  const navigate = useNavigate();
  
  const handleRedirect = (id) => {
    navigate(`/blog/${id}`);
};
  return (
    <Card
      variant="plain"
      sx={{
        display: "flex",
        // maxWidth:'200px',
        p: 0,
        cursor:'pointer',
        "--Card-radius": "20px",
        transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.025)',
          },
      }}
      onClick={() => handleRedirect(id)}
    >
        
      <Stack direction="column" spacing={1.5} flexGrow={1}>
        <AspectRatio ratio="1">
          <img src={img} alt={title} loading="lazy" />
        </AspectRatio>
        <Stack
          spacing={1}
          direction="column"
          flexGrow={1}
          justifyContent="space-between"
        >
        <Stack
        spacing={1}
        >
          <Typography level="title-lg">{title}</Typography>
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              whiteSpace: "normal",
            }}
          >
            <Typography level="body-md">{description ? description:<></>}</Typography>
          </Box>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default BlogCart;
