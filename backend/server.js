/**
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

const AWS = require("aws-sdk"); // Import AWS SDK v2 (in maintenance mode). Migrate to AWS SDK for Javascript V3 later

const noteRoutes = require("./noteRoutes"); // imports noteRoutes file

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
app.use(cors());

// formats everything into json
app.use(express.json());

//mounting projects, makes projects available to the rest of the app
app.use(projects);

//mounting tasks, makes projects available to the rest of the app
app.use(tasks);


//mounting routes, makes users available to the rest of the app
app.use(users);

//mounting noteRoutes, makes notes available to the rest of the app
app.use(noteRoutes);

// creates the server and tells it to listen on PORT for requests
// callback function runs the connect file once connection is established
app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`server is running on port ${PORT}`);
});
