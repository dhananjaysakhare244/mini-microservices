import React, { FC } from "react";

export interface IComments {
  id: string;
  status: string;
  content: string;
}
type Props = {
  comments: IComments[];
};
const CommentList: FC<Props> = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;
    if (comment.status === "approved") {
      content = comment.content;
    }
    if (comment.status === "pending") {
      content = "awaiting moderation";
    }
    if (comment.status === "rejected") {
      content = "comment has been rejected";
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
