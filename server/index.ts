import express from "express";
import http from "http";
import path from "path";
import { State } from "../interface/osc";

let state: State = {
  filters: [],
  notes: [],
  oscillators: [],
};

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../dist/index.html"))
);

app.get("/state", (req, res) => res.send(state));

app.post("/set-state", (req, res) => {
  const { body } = req;
  if (Array.isArray(body?.oscillators) && Array.isArray(body?.filters)) {
    state = body;
    res.send(state);
  } else {
    res.status(400).send("Invalid payload");
  }
});

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../dist" + req.url))
);

server.listen(3000, () => {
  console.log("Serving localhost:3000");
});
