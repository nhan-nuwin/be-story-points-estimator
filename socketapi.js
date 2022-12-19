const io = require("socket.io")({
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});
const socketapi = {
  io: io,
};

const short = require("short-uuid");
const randimals = require("randimals");
// Model
// User
// {
//   id: socket.id,
//   name: '',
//   vote: null,
// }

// Room
// {
//   id: roomId,
//   users: [],
//   state: showCards / hideCards
// }

const roomsMap = new Map();
let rooms = [];
io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  socket.on("create-room", (roomId) => {
    roomsMap.set(roomId, { id: roomId, users: [], state: "hideCards" });
  });

  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId);

    const user = { id: socket.id, roomId, name, vote: null };

    const room = roomsMap.get(roomId);
    if (room) {
      room.users.push(user);
    }

    updateClient();
  });

  socket.on("vote", ({ roomId, card }) => {
    let room = roomsMap.get(roomId);

    if (room) {
      let notUsers = room.users.filter((user) => user.id !== socket.id);
      let user = room.users.filter((user) => user.id === socket.id)[0];

      if (user) {
        user.vote = card;
        room.users = [...notUsers, user];
      }

      roomsMap.set(roomId, room);
      updateClient();
    }
  });

  socket.on("reset-room", (roomId) => {
    let room = roomsMap.get(roomId);

    if (room) {
      console.log(room.users);
      let users = room.users.map((each) => {
        return { ...each, vote: null };
      });
      room.users = users;

      roomsMap.set(roomId, room);
      updateClient();
    }
  });

  socket.on("hide-cards", (roomId) => {
    roomHideCards(roomId);
    updateClient();
  });

  socket.on("show-cards", (roomId) => {
    roomShowCards(roomId);
    updateClient();
  });
});

io.on("disconnect", (socket) => {
  console.log(socket.id + "disconnected");
});

// Ensures our arrays have unique values before we send it off.
function roomsToArray() {
  let roomsArr = [];
  roomsMap.forEach((room) => roomsArr.push(room));
  rooms = roomsArr;
}

function updateClient() {
  roomsToArray();
  io.emit("update-client", rooms);
}

function roomHideCards(roomId) {
  let room = roomsMap.get(roomId);
  room.state = "hideCards";
}

function roomShowCards(roomId) {
  let room = roomsMap.get(roomId);
  room.state = "showCards";
}

// function removeUser(socketId) {
//   roomsMap.forEach( room => {
//     room.users;

//   });
// }

module.exports = socketapi;
