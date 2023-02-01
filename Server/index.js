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

const gameConfig = {
  width: 580,
  height: 320,
};

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
        gameConfig,
        player1: { ready: false },
        player2: { ready: false },
        score1: 0,
        score2: 0,
        status: "START",
      };

      gameInProgress(roomId);
    }

    refreshPlayers();
    refreshRooms();
    refreshMatch(roomId);

    sendMessage(game.players[socket.id].name, " Entrou em uma sala");
  });

  socket.on("gameLoaded", () => {
    const roomId = game.players[socket.id].room;
    const match = game.match[roomId];
    const player = "player" + (game.rooms[roomId].player1 == socket.id ? 1 : 2);

    match[player] = { ready: true };

    if (match.player1.ready && match.player2.ready) {
      match.status = "PLAY";
      match.ball = {
        width: 5,
        xdirection: 1,
        ydirection: 1,
        xspeed: 2.8,
        yspeed: 2.2,
        x: gameConfig.width / 2,
        y: gameConfig.height / 2,
      };
    }
  });
});

const leaveRoom = (socket) => {
  const socketId = socket.id;
  const roomId = game.players[socketId].room;
  const room = game.rooms[roomId];
  if (room) {
    const match = game.match[roomId];

    game.players[socketId].room = undefined;

    const playerNumber = "player" + (socketId === room.player1 ? 1 : 2);
    room[playerNumber] = undefined;
    if (match) {
      match[playerNumber] = undefined;
      match.status = "END";
      match.message = `O jogador ${game.players[socketId].name} desconectou.`;
    }

    if (!room.player1 && !room.player2) {
      delete game.rooms[roomId];
      if (match) {
        delete game.match[roomId];
      }
    }

    refreshMatch(roomId);
    socket.leave(roomId);
  }
};

const gameInProgress = (roomId) => {
  const match = game.match[roomId];

  if (!match || match.status === "END") {
    return;
  }

  const { ball } = match;

  switch (match.status) {
    case "PLAY":
      const xpos = ball.x + ball.xspeed * ball.xdirection;
      const ypos = ball.y + ball.yspeed * ball.ydirection;

      ball.x = xpos;
      ball.y = ypos;

      if (xpos > match.gameConfig.width - ball.width || xpos < ball.width) {
        ball.xdirection *= -1;
      }

      if (ypos > match.gameConfig.height - ball.width || ypos < ball.width) {
        ball.ydirection *= -1;
      }

      if (xpos < ball.width) {
        match.score2++;
      }

      if (xpos > match.gameConfig.width - ball.width) {
        match.score1++;
      }

      break;
  }

  refreshMatch(roomId);

  setTimeout(() => gameInProgress(roomId), 1000 / 60);
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
  io.to(roomId).emit("matchRefresh", game.match[roomId] || {});
};

server.listen(port, () => {
  console.log(`Server rodando na porta ${port}!`);
});
