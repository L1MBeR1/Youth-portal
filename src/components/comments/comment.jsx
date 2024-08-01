import React from "react";

import { timeAgo } from "../../utils/timeAgo";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Avatar from "@mui/joy/Avatar";
import IconButton from "@mui/joy/IconButton";

import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

export const Comment = ({ comment }) => {
  return (
    <Sheet>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        <Avatar
          src={comment.profile_image_uri}
          alt={comment.nickname}
          variant="outlined"
          size="md"
        />
        <Stack>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
          >
            <Typography level="title-md">
              {comment.first_name} {comment.last_name} ({comment.nickname})
            </Typography>
            <Typography level="body-sm">
              {timeAgo(comment.created_at)}
            </Typography>
          </Stack>
          {comment.parentName ? (
             <Typography level="body-md">{comment.parentName+", "+comment.content}</Typography>
          ):(
            <Typography level="body-md">{comment.content}</Typography>
          )}
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
            sx={{
              marginLeft: "-10px",
            }}
          >
            <Button
              variant="plain"
              color="neutral"
              size="sm"
              sx={{
                borderRadius: "40px",
              }}
            >
              Ответить
            </Button>

            <IconButton
              sx={{
                "--IconButton-size": "30px",
              }}
            >
              <ThumbUpOffAltIcon />
            </IconButton>
            <Typography level="title-sm">{comment.likes}</Typography>
          </Stack>
          
        </Stack>
        
      </Stack>
    </Sheet>
  );
};
