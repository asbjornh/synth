import express from "express";
import http from "http";
import path from "path";
import util from "util";
import { State } from "../interface/state";
import { Player } from "./player";

let state: State = {
  filters: [],
  notes: [],
  oscillators: [],
};

const player = Player({
  bitDepth: 16,
  channels: 2,
  sampleRate: 44100,
});

const onExit = () => {
  player.kill();
  process.exit();
};

process.on("exit", onExit);
process.on("SIGINT", onExit);
process.on("SIGUSR1", onExit);
process.on("SIGUSR2", onExit);

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
    player.setState(state);
    console.clear();
    console.log(util.inspect(state, false, null, true));
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
