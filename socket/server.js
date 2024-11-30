const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const pollController = require("./controllers/pollController");
const voteController = require("./controllers/voteController");

const app = express();
const server = http.createServer(app);

// CORS configuration for Socket.IO and Express
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow connection from the React app
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Allowed headers
  },
});

// Middleware
app.use(cors()); // For Express (this will allow CORS for regular HTTP requests)
app.use(express.json());

// Routes
app.post("/createPoll", pollController.createPoll);
app.get("/getPoll/:pollCode", pollController.getPollData);

// Socket.io event handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for the vote event
  socket.on("vote", async (pollCode, username, choiceId) => {
    try {
      // Handle vote
      const updatedPollData = await voteController.handleVote(
        io,
        socket,
        pollCode,
        username,
        choiceId
      );

      // Emit the updated poll data to all clients
      io.emit("pollData", updatedPollData);
    } catch (error) {
      console.error("Error handling vote:", error);
      socket.emit("voteError", {
        error: "There was an error processing your vote.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
