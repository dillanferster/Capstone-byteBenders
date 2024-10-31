/** backend/server.js
 *
 * This file creates the node server
 *
 * listen for HTTP requests on port 3000
 *
 *
 *  References for this file are from
 *  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
 *
 *  */

import connect from "./connect.js"; // imports ./connect file from backend, saves it in the database variable
import express from "express"; // imports express object from the npm i express, saves it in in express variable
import cors from "cors"; // imports cors from npm i cors
import projects from "./projectRoutes.js"; // imports projectRoutes file
import tasks from "./taskRoutes.js"; // imports projectRoutes file
import users from "./userRoutes.js"; // imports userRoutes file
import notes from "./noteRoutes.js"; // imports noteRoutes file
import session from "express-session"; // imports session management
import emails from "./emailRoutes.js"; // imports emailRoutes
import events from "./calendarRoutes.js"; // imports calendarRoutes
import AWS from "aws-sdk"; // Import AWS SDK v2 (in maintenance mode). Migrate to AWS SDK for Javascript V3 later
import cookieParser from "cookie-parser"; // Import cookie-parser
import { config } from "dotenv"; // Load environment variables

// Configure dotenv
config({ path: "./.env" });

const app = express(); // creates express application instance

// specifies what port the server will listen for requests on
const PORT = 3000;
////////////////////////// AWS Comprehend //////////////////////////
// // AWS SDK configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const comprehend = new AWS.Comprehend(); // Initialize Comprehend
////////////////////////// AWS Comprehend //////////////////////////

// deals with cors domain information
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend to communicate with backend
    credentials: true, // Allow cookies and sessions
  })
);

// Initialize session middleware
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

// formats everything into json
app.use(express.json());

//mounting projects, makes projects available to the rest of the app
app.use(projects);

//mounting tasks, makes projects available to the rest of the app
app.use(tasks);

// mounting notes, makes notes available to the rest of the app
app.use(notes);

//mounting routes, makes users available to the rest of the app
app.use(users);

//mounting emailRoutes, makes emailRoutes available to the rest of the app
app.use(emails);

//mounting calendarRoutes, makes calendarRoutes available to the rest of the app
app.use(events);

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// creates the server and tells it to listen on PORT for requests
// callback function runs the connect file once connection is established
app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`server is running on port ${PORT}`);
});
