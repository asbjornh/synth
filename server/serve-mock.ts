import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { initialState } from "../interface/state";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.get("/", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../dist/index.html"))
);

app.get("/state", (req, res) => res.send(initialState));
app.post("/set-state", (req, res) => res.send(req.body));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../dist" + req.url))
);

server.listen(3000, () => {
  console.log("Serving localhost:3000");
});
