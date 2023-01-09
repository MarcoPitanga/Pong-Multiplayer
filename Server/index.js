const port = 4000;
const express = require("express");
const app = express();
const http = require("http");
const { Socket } = require("socket.io");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const game = {
  players: {},
  rooms: {},
  match: {},
};

app.get("/", (req, res) => res.send("Hello World!"));

io.on("connection", (socket) => {
  const name = "Player_" + socket.id.substr(0, 5);
  game.players[socket.id] = { name };

  sendMessage(game.players[socket.id].name, " Entrou");

  refreshPlayers();
  refreshRooms();

  socket.on("disconnect", () => {
    sendMessage(game.players[socket.id].name, " Saiu");
    leaveRoom(socket);

    delete game.players[socket.id];

    refreshPlayers();
    refreshRooms();
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
    leaveRoom(socket);

    refreshPlayers();
    refreshRooms();
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    const position = game.rooms[roomId].player1 ? "2" : "1";

    game.rooms[roomId][`player${position}`] = socket.id;

    game.players[socket.id].room = roomId;

    const room = game.rooms[roomId];

    if (room.player1 && room.player2) {
      game.match[roomId] = {
        score1: 0,
        score2: 0,
        status: "START",
      };
    }

    refreshPlayers();
    refreshRooms();
    refreshMatch(roomId);

    sendMessage(game.players[socket.id].name, " Entrou em uma sala");
  });
});

const leaveRoom = (socket) => {
  const socketId = socket.id;
  const roomId = game.players[socketId].room;
  const room = game.rooms[roomId];

  if (room) {
    socket.leave(roomId);

    game.players[socketId].room = undefined;

    if (socketId == room.player1) {
      room.player1 = undefined;
    } else {
      room.player2 = undefined;
    }

    if (!room.player1 && !room.player2) {
      delete game.rooms[roomId];
    }
  }
};

const sendMessage = (player, message) => {
  io.emit("receiveMessage", `${player}${message}`);
};

const refreshPlayers = () => {
  io.emit("playerRefresh", game.players);
};

const refreshRooms = () => {
  io.emit("roomsRefresh", game.rooms);
};

const refreshMatch = (roomId) => {
  io.to(roomId).emit("matchRefresh", game.match[roomId]);
};

server.listen(port, () => {
  console.log(`Server rodando na porta ${port}!`);
});
