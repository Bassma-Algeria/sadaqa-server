const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// parse the incoming body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// set routes and socket
const router = require("./routes/index");

const socketHandler = require("./socket");
socketHandler(io);

app.use("/api", router);

// for ssl verification
app.get("/.well-known/acme-challenge/3oeIEPfdT528H4UKek-oYVeD0aPHzTq3N3-zXc3U7Fk", (req, res) => {
  res.sendFile(__dirname + "/ssl/sslCode.txt");
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
