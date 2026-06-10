const aiRoutes =
  require("./routes/aiRoutes");

const rateLimit =
  require("express-rate-limit");

const authRoutes =
  require("./routes/authRoutes");

const express =
  require("express");

const mongoose =
  require("mongoose");

const cors =
  require("cors");

const http =
  require("http");

const { Server } =
  require("socket.io");

require("dotenv").config();

const ticketRoutes =
  require("./routes/ticketRoutes");

const customerRoutes =
  require("./routes/customerRoutes");

const agentRoutes =
  require("./routes/agentRoutes");

const app = express();

const searchLimiter =
  rateLimit({
    windowMs: 60 * 1000,
    max: 35,
    message:
      "Too many requests. Please try again later.",
  });

const server =
  http.createServer(app);

// SOCKET.IO SETUP
const io = new Server(
  server,
  {
    cors: {
      origin:
        "http://localhost:5173",
      methods: [
        "GET",
        "POST",
      ],
    },
  }
);

// Make io accessible in routes
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

let notifications = [];

// Routes
app.use(
  "/api/agents",
  agentRoutes
);

app.use(
  "/api/customers",
  customerRoutes
);

app.use(
  "/tickets",
  searchLimiter,
  ticketRoutes
);

app.use(
  "/auth",
  authRoutes
);

app.use(
  "/ai",
  aiRoutes
);
app.use(
  "/api/customers",
  customerRoutes
);

// Notifications API
app.get(
  "/notifications",
  (req, res) => {
    res.json(notifications);
  }
);
// MongoDB Connection
mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log(
      "MongoDB Connected Successfully"
    );
  })
  .catch((err) => {
    console.log(err);
  });

// Socket Connection
io.on(
  "connection",
  (socket) => {
    console.log(
      "User connected:",
      socket.id
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          "User disconnected"
        );
      }
    );
  }
);

// Server
const PORT =
  process.env.PORT ||
  5000;

server.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);