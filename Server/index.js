const port = 4000;
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const game = {
  players: {},
};

app.get("/", (req, res) => res.send("Hello World!"));

io.on("connection", (socket) => {
  console.log(`${socket.id} conectado!`);

  const name = "Player_" + socket.id.substr(0, 5);
  game.players[socket.id] = { name };

  refreshPlayers();

  socket.on("disconnect", () => {
    delete game.players[socket.id];
    refreshPlayers();
  });
});

const refreshPlayers = () => {
  io.emit("playerRefresh", game.players);
};

server.listen(port, () => {
  console.log(`Server rodando na porta ${port}!`);
});
