import React, { useState } from "react";
import { Comment } from "./comment";
import { textDeclension } from "../../utils/textDeclension";

import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Box from '@mui/joy/Box';

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
              {openReplies ? ('Скрыть'):'Показать'} {textDeclension(comment.replies.length,'ответ','ответа','ответов')} 
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
                  margin: "10px 0 0 40px",
                  paddingLeft: "20px",
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
