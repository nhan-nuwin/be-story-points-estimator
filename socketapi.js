const io = require("socket.io")({
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});
const socketapi = {
  io: io,
};

// Add your socket.io logic here!
io.on("connection", function (socket) {
  console.log(socket.id + " connected");
});

io.on("disconnect", (socket) => {
  console.log(socket.id + "disconnected");
});
// end of socket.io logic

module.exports = socketapi;
