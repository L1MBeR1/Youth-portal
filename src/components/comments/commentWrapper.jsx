import React, { useState } from "react";

import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Box from '@mui/joy/Box';
import { Comment } from "./comment";
export const CommentWrapper = ({ comment }) => {
  const [openReplies, setOpenReplies] = useState(false);

  const handleOpenReplies = () => {
    setOpenReplies(!openReplies);
  };
  return (
    <>
      {comment.replies.length !== 0 ? (
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={0.5}
        >
          <Comment comment={comment} />
          <Box
          sx={{
            paddingLeft:'45px'
          }}
          >
            <Button
              variant="plain"
              size="sm"
              sx={{
                borderRadius: "40px",
              }}
              onClick={handleOpenReplies}
            >
              Показать {comment.replies.length} ответов
            </Button>
          </Box>
          <Stack>
            {openReplies && (
              <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={2}
                sx={{
                  margin: "10px 40px",
                  padding: "0px 20px",
                  borderLeft: "1px solid",
                  borderColor: "divider",
                }}
              >
                {comment.replies.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      ) : (
        <Comment comment={comment} />
      )}
    </>
  );
};
