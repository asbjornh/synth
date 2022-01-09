import express from "express";
import http from "http";
import path from "path";
import util from "util";
import { Server } from "socket.io";
import { Options, Player } from "./player";
import { deletePreset, getPresets, savePreset } from "./presets";
import { frequencies } from "./frequencies";
import { transpose } from "./osc";

const debug = process.argv.includes("--debug");

const opts: Options = {
  bitDepth: 32,
  channels: 2,
  sampleRate: 44100,
};

const player = Player(opts);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const onExit = () => {
  player.kill();
  server.close();
  io.close();
  process.exit();
};

process.on("exit", onExit);
process.on("SIGINT", onExit);
process.on("SIGUSR1", onExit);
process.on("SIGUSR2", onExit);

player.onFrame((samples, state, notes, t) => {
  if (notes.length === 1) {
    const [note] = notes;
    io.emit("frame", {
      samples,
      freq: frequencies[note.note] * transpose(state.master.transpose, 0),
      sampleRate: opts.sampleRate,
      t,
    });
  } else {
    io.emit("frame", { samples: [], freq: 0, sampleRate: opts.sampleRate, t });
  }
});

app.use(express.json());

app.get("/", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../dist/index.html"))
);

app.post("/config", (req, res) => {
  const { body } = req;
  if (Array.isArray(body?.oscillators)) {
    player.setState(body);
    if (debug) {
      console.clear();
      console.log(util.inspect(body, false, null, true));
    }
    res.send(body);
  } else {
    res.status(400).send("Invalid payload");
  }
});

app.post("/play", (req, res) => {
  const { body } = req;
  if (Array.isArray(body)) {
    player.onPlay(body);
    res.send(body);
  } else {
    res.status(400).send("Invalid payload");
  }
});

app.post("/presets", (req, res) => {
  const { body } = req;
  try {
    res.send(savePreset(body));
  } catch (e: any) {
    res.status(500).send(e.message || "Unknown error");
  }
});

app.get("/presets", (req, res) => {
  try {
    res.send(getPresets());
  } catch (e: any) {
    res.status(500).send(e.message || "Unknown error");
  }
});

app.delete("/presets", (req, res) => {
  const { body } = req;
  try {
    res.send(deletePreset(body));
  } catch (e: any) {
    res.status(500).send(e.message || "Unknown error");
  }
});

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../dist" + req.url))
);

server.listen(3000, () => {
  console.log("Serving localhost:3000");
});
