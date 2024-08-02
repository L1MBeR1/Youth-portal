import React, { useState, useEffect } from "react";
import { CommentWrapper } from "./commentWrapper.jsx";
import { CommentInput } from "./commentInput.jsx";
import { textDeclension } from "../../utils/textDeclension.js";

import Stack from "@mui/joy/Stack";
import { Typography, Button, Select, Option } from "@mui/joy";

import SortIcon from '@mui/icons-material/Sort';

const buildCommentsStructure = (comments) => {
    const commentsMap = {};
    const rootComments = [];

    comments.forEach(comment => {
        commentsMap[comment.id] = { ...comment, replies: [], parentName: null };
    });

    comments.forEach(comment => {
        if (comment.reply_to) {
            const parentComment = commentsMap[comment.reply_to];
            if (parentComment) {
                parentComment.replies.push(commentsMap[comment.id]);
                commentsMap[comment.id].parentName = parentComment.first_name;
            }
        } else {
            rootComments.push(commentsMap[comment.id]);
        }
    });

    const addAllReplies = (comment) => {
        const allReplies = [];

        const collectReplies = (reply) => {
            allReplies.push(reply);
            reply.replies.forEach(childReply => collectReplies(childReply));
        };

        comment.replies.forEach(reply => collectReplies(reply));
        return allReplies;
    };

    rootComments.forEach(comment => {
        comment.replies = addAllReplies(comment);
        comment.replies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    });

    //console.log(rootComments);
    return rootComments;
};

const sortComments = (comments, sortType) => {
    let sortedComments;
    switch (sortType) {
        case 'newest':
            sortedComments = [...comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'oldest':
            sortedComments = [...comments].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
        case 'popular':
            sortedComments = [...comments].sort((a, b) => b.likes - a.likes);
            break;
        default:
            sortedComments = comments;
    }
    return sortedComments;
};

export const CommentSection = ({ data }) => {
    console.log(data);
    const [sortType, setSortType] = useState('oldest');
    const [initialComments, setInitialComments] = useState([]);
    const [comments, setComments] = useState([]);
    const [visibleComments, setVisibleComments] = useState(5);

    useEffect(() => {
        const structuredComments = buildCommentsStructure(data);
        setInitialComments(structuredComments);
        setComments(sortComments(structuredComments, 'oldest'));
    }, [data]);

    useEffect(() => {
        setComments(sortComments(initialComments, sortType));
    }, [sortType, initialComments]);

    const loadMoreComments = () => {
        setVisibleComments(prev => prev + 10); 
    };


    return (
        <Stack
            direction={'column'}
            spacing={4}
        >
            <Stack
                direction={'column'}
                spacing={1.5}
            >

                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems="center"
                >
                    <Stack
                        direction={'row'}
                        spacing={1.5}
                        alignItems="flex-end"
                    >
                        
                        <Typography level='h3'>Комментарии</Typography>
                        <Typography fontSize="20px" fontWeight="lg">{data.length}</Typography>
                    </Stack>
                    <Select
                        placeholder="Сначала старые"
                        variant="plain"
                        defaultValue="oldest"
                        endDecorator={<SortIcon />}
                        indicator={null}
                        color="neutral"
                        onChange={(e, newValue) => setSortType(newValue)}
                    >
                        <Option value="newest">Сначала новые</Option>
                        <Option value="oldest">Сначала старые</Option>
                        <Option value="popular">Сначала популярные</Option>
                    </Select>
                </Stack>
                <CommentInput></CommentInput>
            </Stack>
            <Stack spacing={1.5}>
                {comments.length === 0 ? (
                    <Typography>Нет комментариев для отображения</Typography>
                ) : (
                    comments.slice(0, visibleComments).map(comment => (
                        <CommentWrapper key={comment.id} comment={comment} />
                    ))
                )}
            </Stack>
            {comments.length > visibleComments && (
                <Button onClick={loadMoreComments} variant="plain" color="neutral"
                sx={{
                    borderRadius: "40px",
                  }}
                >
                    Ещё 10 комментариев
                </Button>
            )}
        </Stack>
    );
};
