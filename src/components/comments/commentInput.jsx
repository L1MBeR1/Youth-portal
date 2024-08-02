import React from "react";

import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import useProfile from '../../hooks/useProfile';
export const CommentInput = () => {
const { data: profileData } = useProfile();
  return (
    <Stack
    direction='row'
    spacing={2}
    width='100%'
    >
        <Avatar
        src={profileData.profile_image_uri}
        alt={profileData.nickname}
        variant="outlined"
        sx={{
            "--Avatar-size":'60px'
        }}
        />
        <Input
        placeholder="Введите комментарий"
          sx={{
            flexGrow:1,
            '--Input-minHeight': '56px',
            "--Input-paddingInline": "25px",
            '--Input-radius': '50px',
          }}
        endDecorator={<IconButton size="lg" color="primary" variant="soft"><ArrowUpwardIcon/></IconButton>}
        >
        </Input>
    </Stack>
  );
};
