import { Request, Response } from "express";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

interface ICommentByPostId {
  id: string;
  content: string;
  status: string;
  postId: string;
}
interface ReqBody {
  content: string;
  type: string;
  data: ICommentByPostId;
}

interface IPost {
  id: string;
  title: string;
  comments: ICommentByPostId[];
}
interface ICommentByPostId {
  id: string;
  content: string;
  status: string;
  postId: string;
}
const posts: IPost[] = [];

const handleEvent = (type: string, data: IPost | ICommentByPostId) => {
  if (type === "PostCreated") {
    const { id, title } = data as IPost;

    posts.push({ id, title, comments: [] });
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data as ICommentByPostId;

    const post = posts.find((post) => post.id === postId);
    if (post) post.comments.push({ id, content, status, postId });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data as ICommentByPostId;

    const post = posts.find((post) => post.id === postId)!;
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    })!;

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req: Request<{}, {}, {}, {}>, res: Response) => {
  res.send(posts);
});

app.post("/events", (req: Request<{}, {}, ReqBody, {}>, res: Response) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  try {
    const res = await axios.get("http://localhost:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error: any) {
    console.log(error.message);
  }
});
