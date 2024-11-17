/** 
 * backend/server.js
 *
 * This file creates the Node.js server and sets up routes, middleware, and real-time communication using Socket.IO.
 *
 * The server listens for HTTP requests on port 3000.
 *
 * References:
 * https://socket.io/docs/v4/
 * https://expressjs.com/
 * https://www.npmjs.com/package/cors
 */

// Import database connection module
const connect = require("./connect");

// Import Express framework for handling HTTP requests
const express = require("express");

// Import CORS middleware to handle cross-origin requests
const cors = require("cors");

// Import route handlers for different modules
const projects = require("./projectRoutes");
const tasks = require("./taskRoutes");
const users = require("./userRoutes");
const notes = require("./noteRoutes");
const emails = require("./emailRoutes");
const events = require("./calendarRoutes");

// Import session and cookie management middleware
const session = require("express-session");
const cookieParser = require("cookie-parser");

// Load environment variables from .env file
require("dotenv").config({ path: "./.env" });

// Initialize Express application
const app = express();

// Import HTTP and Socket.IO modules for real-time communication
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from frontend
    methods: ["GET", "POST"], // Allow specific HTTP methods
    credentials: true, // Allow cookies and credentials
  },
});

// Define the port the server will listen on
const PORT = 3000;

// AWS Comprehend configuration
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const comprehend = new AWS.Comprehend(); // Initialize AWS Comprehend

/** Middleware Configuration **/

// Enable CORS to allow communication between frontend and backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Initialize session management
app.use(
  session({
    secret: process.env.AZURE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Use cookie-parser middleware
app.use(cookieParser());

// Parse incoming JSON requests
app.use(express.json());

/** Socket.IO Real-time Communication **/

// Handle Socket.IO connection events
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`); // Log when a client connects

  // Handle custom event 'sendNotification' from the client
  socket.on("sendNotification", (data) => {
    console.log("Notification data received:", data);

    // Broadcast the notification to all connected clients
    io.emit("notification", data);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Attach Socket.IO instance to Express request object for use in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

/** Mount Routes **/

// Mount project routes
app.use(projects);

// Mount task routes
app.use(tasks);

// Mount note routes
app.use(notes);

// Mount user routes
app.use(users);

// Mount email routes
app.use(emails);

// Mount calendar routes
app.use(events);

/** Error Handling Middleware **/

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).send("Something broke!"); // Send generic error response
});

/** Start the Server **/

// Start the server and connect to the database
server.listen(PORT, () => {
  connect.connectToServer(); // Initialize database connection
  console.log(`Server is running on http://localhost:${PORT}`);
});
