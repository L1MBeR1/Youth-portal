import React from "react";
import Stack from "@mui/joy/Stack";
import { CommentWrapper } from "./commentWrapper.jsx";
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
    console.log(rootComments)
    return rootComments;
};
const sortComments=(comments,sortType)=>{
    return comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}
export const CommentSection=({data,sortType})=>{

    const comments=sortComments(buildCommentsStructure(data));

    return(
        <Stack
        spacing={1.5}
        >
            {comments.map(comment => (
                <CommentWrapper key={comment.id}comment={comment}/>
            ))}
        </Stack>
    );
}