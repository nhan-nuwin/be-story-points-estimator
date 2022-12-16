const io = require("socket.io")({
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});
const socketapi = {
  io: io,
};

const short = require('short-uuid');
// Add your socket.io logic here!
// io.on("connection", function (socket) {
//   console.log(socket.id + " connected");
//   const userId = socket.id;

//   socket.join(userId);

//   // and then later
//   io.to(userId).emit("hi");
// });
const users = new Map()
const rooms = []
const pokerParty = new Map()
io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  io.emit("message", "hi")

  socket.on("create-room", () => {
    const roomId = short.generate();
    rooms.push(roomId)
    console.log("created a room: " + roomId);
    io.emit("create-room-emit", roomId)
  });

  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId) // case for if room id does not exist
    users.set({ name }, socket.id)
    pokerParty.set(name, roomId)
    console.log("welcome " + name + " to room " + roomId);
    io.to(roomId).emit('user-id', name)
  });

  socket.on("get-name-client", ({ name }) => {
    let sid = users.get(name)
    io.emit('get-name-server', sid)
  })



  // const userId = socket.id;
  // socket.join("example-room");
  // const rooms = io.of("/").adapter.rooms;
  // const sids = io.of("/").adapter.sids;
  // console.log(rooms)
  // // and then later
  // io.to("example-room").emit("hi");
});

io.on("disconnect", (socket) => {
  console.log(socket.id + "disconnected");
});
// end of socket.io logic

module.exports = socketapi;
