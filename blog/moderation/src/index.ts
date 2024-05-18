import { Request, Response } from "express";

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
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

app.use(bodyParser.json());

app.post(
  "/events",
  async (req: Request<{}, {}, ReqBody, {}>, res: Response) => {
    const { type, data } = req.body;
    if (type === "CommentCreated") {
      const status = data.content.includes("orange") ? "rejected" : "approved";

      await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          ...data,
          status,
        },
      });
    }
    res.send({}); // send empty response otherwise this request will hang
  }
);

app.listen(4003, () => {
  console.log("Moderation Listening on 4003");
});
