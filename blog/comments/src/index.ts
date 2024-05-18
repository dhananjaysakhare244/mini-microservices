import { Request, Response } from "express";

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { randomBytes } = require("crypto");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());

interface ICommentByPostId {
  id: string;
  content: string;
  status: string;
  postId: string;
}
interface Params {
  id: string;
}
interface ReqBody {
  content: string;
  type: string;
  data: ICommentByPostId;
}
let commentsByPostId: ICommentByPostId[] = [];

app.get(
  "/posts/:id/comments",
  (req: Request<Params, {}, {}, {}>, res: Response) => {
    res.send(commentsByPostId.find((c) => c.id === req.params.id) || []);
  }
);

app.post(
  "/posts/:id/comments",
  async (req: Request<Params, {}, ReqBody, {}>, res: Response) => {
    const commentId: string = randomBytes(4).toString("hex");

    const { content } = req.body;
    const comments = commentsByPostId.find((c) => c.id === req.params.id) || [];
    const newComment: ICommentByPostId = {
      id: commentId,
      content,
      status: "pending",
      postId: req.params.id,
    };
    commentsByPostId = [...commentsByPostId, newComment];

    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: newComment,
    });
    res.status(201).send(comments);
  }
);

app.post(
  "/events",
  async (req: Request<Params, {}, ReqBody, {}>, res: Response) => {
    console.log("Event", req.body.type);
    const { type, data } = req.body;
    if (type === "CommentModerated") {
      const comment = commentsByPostId.find(
        (cmt) => cmt.postId === data.postId
      );
      if (comment) comment.status = data.status;
      await axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data,
      });
    }
    res.send({});
  }
);

app.listen(4001, () => {
  console.log("Listening on 4001");
});
