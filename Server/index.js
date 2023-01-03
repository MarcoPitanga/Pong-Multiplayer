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
  rooms: {},
};

app.get("/", (req, res) => res.send("Hello World!"));

io.on("connection", (socket) => {
  const name = "Player_" + socket.id.substr(0, 5);
  game.players[socket.id] = { name };

  sendMessage(game.players[socket.id].name, " Entrou");

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

  socket.on("createRoom", () => {
    socket.join(socket.id);

    game.rooms[socket.id] = {
      name: `Sala do ${game.players[socket.id].name}`,
      player1: socket.id,
      player2: undefined,
    };
    game.players[socket.id].room = socket.id;

    refreshPlayers();
    refreshRooms();

    sendMessage(game.players[socket.id].name, " Criou uma sala");
  });

  socket.on("leaveRoom", () => {
    const roomId = game.players[socket.id].room;
    const room = game.rooms[roomId];

    game.players[socket.id].room = undefined;

    if (socket.id == room.player1) {
      room.player1 = undefined;
    } else {
      room.player2 = undefined;
    }

    if (!room.player1 && !room.player2) {
      delete game.rooms[roomId];
    }

    refreshPlayers();
    refreshRooms();
  });
});

const sendMessage = (player, message) => {
  io.emit("receiveMessage", `${player}${message}`);
};

const refreshPlayers = () => {
  io.emit("playerRefresh", game.players);
};

const refreshRooms = () => {
  io.emit("roomsRefresh", game.rooms);
};

server.listen(port, () => {
  console.log(`Server rodando na porta ${port}!`);
});
