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

const connect = require("./connect"); // imports ./connect file from backend, saves it in the database variable

const express = require("express"); // imports express object from the npm i express, saves it in in express variable

const cors = require("cors"); // imports cors from npm i cors

const projects = require("./projectRoutes"); // imports projectRoutes file

const tasks = require("./taskRoutes"); // imports projectRoutes file

const users = require("./userRoutes"); // imports userRoutes file

const notes = require("./noteRoutes"); // imports noteRoutes file

const session = require("express-session"); // imports session management

const emails = require("./emailRoutes"); // imports emailRoutes

const events = require("./calendarRoutes"); // imports calendarRoutes

const AWS = require("aws-sdk"); // Import AWS SDK v2 (in maintenance mode). Migrate to AWS SDK for Javascript V3 later

require("dotenv").config({ path: "./.env" }); // Load environment variables

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
    origin: "http://localhost:5173", // Allow your frontend to communicate with backend
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

// creates the server and tells it to listen on PORT for requests
// callback function runs the connect file once connection is established
app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`server is running on port ${PORT}`);
});
