const io = require("socket.io")({
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});
const socketapi = {
  io: io,
};

const short = require("short-uuid");
const randimals = require("randimals");
// Add your socket.io logic here!
// io.on("connection", function (socket) {
//   console.log(socket.id + " connected");
//   const userId = socket.id;

//   socket.join(userId);

//   // and then later
//   io.to(userId).emit("hi");
// });

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
//   captain: socket.id
// }

const usersMap = new Map();
const roomsMap = new Map();
let users = [];
let rooms = [];
// const pokerParty = new Map();
io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  socket.on("create-room", () => {
    const roomId = randimals({
      adjectives: 1,
      animals: 1,
      case: "capital",
      separator: "none",
      format: "snake",
    });

    roomsMap.set(roomId, { id: roomId, users: [] });
    console.log("created a room: " + roomId);
    io.emit("create-room-emit", roomId);
  });

  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId);

    const user = { id: socket.id, roomId, name, vote: null };
    usersMap.set(socket.id, user);
    usersToArray();

    const room = roomsMap.get(roomId);
    // insure users are in the correct rooms
    const usersArr = users.filter((user) => user.roomId === roomId);
    if (room) {
      room.users = usersArr;
    }

    console.log("welcome " + name + " to room " + roomId);
    io.to(roomId).emit("user-id", name);
    updateClient();
  });

  socket.on("get-name-client", () => {
    let user = usersMap.get(socket.id);

    if (user) {
      io.emit("get-name-server", user);
    } else {
      io.emit("new-user-server");
    }
  });
});
2;
function updateClient() {
  roomsToArray();
  io.emit("update-client", rooms);
}

io.on("disconnect", (socket) => {
  console.log(socket.id + "disconnected");
});
// end of socket.io logic

// Ensures our arrays have unique values before we send it off.
function usersToArray() {
  let userArr = [];
  usersMap.forEach((user) => userArr.push(user));
  users = userArr;
}
function roomsToArray() {
  let roomsArr = [];
  roomsMap.forEach((room) => roomsArr.push(room));
  rooms = roomsArr;
}

module.exports = socketapi;
