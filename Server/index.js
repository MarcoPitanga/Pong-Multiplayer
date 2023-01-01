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
  const name = "Player_" + socket.id.substr(0, 5);
  game.players[socket.id] = { name };
  sendMessage(name, " Entrou");
  refreshPlayers();

  socket.on("disconnect", () => {
    const player = game.players[socket.id];
    delete game.players[socket.id];
    sendMessage(player.name, " Saiu");
    refreshPlayers();
  });

  socket.on("sendMessage", (message) => {
    const player = game.players[socket.id];
    sendMessage(player.name, `: ${message}`);
  });
});

const sendMessage = (player, message) => {
  io.emit("receiveMessage", `${player}${message}`);
};

const refreshPlayers = () => {
  io.emit("playerRefresh", game.players);
};

server.listen(port, () => {
  console.log(`Server rodando na porta ${port}!`);
});
