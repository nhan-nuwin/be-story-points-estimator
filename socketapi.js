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
io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  io.emit("message", "hi")

  socket.on("create-room", () => {
    const roomId = 'bunny'
    console.log("created a room: " + roomId);
    io.emit("create-room-emit", roomId)
  });

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId) // case for if room id does not exist 
    console.log("welcome " + socket.id + " to room " + roomId);
    io.emit('user-id', socket.id)
  });

  socket.on("entered-name", ({ name }) => {
    users.set(socket.id, { name })
    io.emit('stored name', name)
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
