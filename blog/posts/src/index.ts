import { Request, Response } from "express";
const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

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
interface ReqBody {
  content: string;
  type: string;
  data: ICommentByPostId;
}

interface IPost {
  id: string;
  title: string;
}
const posts: IPost[] = [];

app.get("/posts", (req: Request<{}, {}, {}, {}>, res: Response) => {
  res.send(posts);
});

app.post("/posts", async (req: Request<{}, {}, IPost, {}>, res: Response) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts.push({ id, title });

  res.status(201).send(posts.find((post) => post.id === id));
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });
});

app.post("/events", (req: Request<{}, {}, ReqBody, {}>, res: Response) => {
  console.log("Event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
