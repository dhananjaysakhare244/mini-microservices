import { Request, Response } from "express";

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

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
const events: ReqBody[] = [];

app.post("/events", (req: Request<{}, {}, ReqBody, {}>, res: Response) => {
  const event = req.body;

  events.push(event);

  axios.post("http://localhost:4000/events", event).catch((err: any) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4001/events", event).catch((err: any) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4002/events", event).catch((err: any) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4003/events", event).catch((err: any) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
});

app.get("/events", (req: Request<{}, {}, ReqBody, {}>, res: Response) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005 for event-bus");
});
