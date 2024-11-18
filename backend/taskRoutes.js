/**
 *
 * This file creates all of the project routes
 *
 * once server gets a request it finds corresponding route and the logic in route gets * executed
 *
 *  Exports as  projectRoutes
 *
 *  References for this file are from
 *  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
 *
 *  */

const express = require("express"); // imports express object from the npm i express, saves it in in express variable
const database = require("./connect"); // imports ./connect file from backend, saves it in the database variable
const { verifyToken } = require("./middleware/auth"); // imports verifyToken function from authMiddleware file
require("dotenv").config({ path: "./.env" }); // imports dotenv , loads the environment variables from .env file

// sets the express object router function as projectRoutes variable
let taskRoutes = express.Router();

// imports from mongodb to convert string to object id
const ObjectId = require("mongodb").ObjectId;

// Read all / GET
// async callback function, passes in HTTP request and response object
// uses the express projectRoutes object to set the GET route as "/projects"
// uses the getDB function from the ./connect file to return the DB
// awaits, goes into DB collection "projects" and finds all, returns as array, saves as data
// check to make sure data  has a value then returns response in json, if not gives an error
// Authenticated route, verifyToken middleware is called before the async function is executed
// References for this file are from  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
taskRoutes.route("/tasks").get(verifyToken, async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("FrankTask").find({}).toArray();

  if (data.length > 0) {
    response.json(data);
  } else {
    throw new Error("data was not found");
  }
});

// Read One / GET
// async callback function, passes in HTTP request and response object
// uses the express projectRoutes object to set the GET route as "/projects/:id"
// uses the getDB function from the ./connect file to return the DB
// awaits, goes into DB collection "projects" and  calls findsOne method, passing in the "id" from the route to find item in database with matching "id", returns as array, saves as data
// check to make sure data  has a value then returns response in json, if not gives an error
// * new ObjectId(request.params.id), converts the id string in a MongoDb id
// * (Object.keys(data.length > 0) , because object doesnt have a length need to grab its keys and see if there are more than 0
// Authenticated route, verifyToken middleware is called before the async function is executed
// References for this file are from  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
taskRoutes.route("/tasks/:id").get(verifyToken, async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("FrankTask")
    .findOne({ _id: new ObjectId(request.params.id) });

  try {
    let db = database.getDb();
    let data = await db
      .collection("FrankTask")
      .findOne({ _id: new ObjectId(request.params.id) });

    if (!data) {
      return response.status(404).json({ error: "Task not found" });
    }

    response.json(data);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// create one / POST
// async callback function, passes in HTTP request and response object
// uses the express projectRoutes object to set the POST route as "/projects"
// uses the getDB function from the ./connect file to return the DB
// creates a new object stored as MongoObject, each property of the object is set by the request object with the corresponding name, this will be passed in when the request is sent
//  awaits, goes into DB collection "projects" and uses mongo insertOne function to add the MongoObject into the database
// sends JSON response back to client
// Authenticated route, verifyToken middleware is called before the async function is executed
// References for this file are from  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
taskRoutes.route("/tasks").post(verifyToken, async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    assignedTo: request.body.assignedTo,
    projectId: request.body.projectId,
    taskName: request.body.taskName,
    taskStatus: request.body.taskStatus,
    priority: request.body.priority,
    taskCategory: request.body.taskCategory,
    startDate: request.body.startDate,
    dueDate: request.body.dueDate,
    projectStatus: request.body.projectStatus,
    projectTask: request.body.projectTask,
    addChronicles: request.body.addChronicles,
    taskDesc: request.body.taskDesc,
    attachments: request.body.attachments,
    chroniclesComplete: request.body.chroniclesComplete,
    dependencies: request.body.dependencies,
  };
  let data = await db.collection("FrankTask").insertOne(mongoObject);
  response.json(data);
});

// update one / PUT
// async callback function, passes in HTTP request and response object
// uses the express projectRoutes object to set the POST route as "/projects/:id"
// uses the getDB function from the ./connect file to return the DB
// creates an updated object stored as MongoObject, each property of the object is set by the request object with the corresponding name, this will be passed in when the request is sent
//  awaits, goes into DB collection "projects" and uses mongo updateOne function to add the updated MongoObject into the database where the id of the request object matches the database object
// sends JSON response back to client
// * new ObjectId(request.params.id), converts the id string in a MongoDb id
// Authenticated route, verifyToken middleware is called before the async function is executed
// References for this file are from  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
taskRoutes.route("/tasks/:id").put(verifyToken, async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    $set: {
      assignedTo: request.body.assignedTo,
      projectId: request.body.projectId,
      taskName: request.body.taskName,
      taskStatus: request.body.taskStatus,
      priority: request.body.priority,
      taskCategory: request.body.taskCategory,
      startDate: request.body.startDate,
      dueDate: request.body.dueDate,
      projectTask: request.body.projectTask,
      projectStatus: request.body.projectStatus,
      addChronicles: request.body.addChronicles,
      taskDesc: request.body.taskDesc,
      attachments: request.body.attachments,
      chroniclesComplete: request.body.chroniclesComplete,
      dependencies: request.body.dependencies,
    },
  };
  let data = await db
    .collection("FrankTask")
    .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
  response.json(data);
});

// Delete One / delete
// async callback function, passes in HTTP request and response object
// uses the express projectRoutes object to set the GET route as "/projects/:id"
// uses the getDB function from the ./connect file to return the DB
// awaits, goes into DB collection "projects" and  calls deleteOne method, passing in the "id" from the route to find item in database with matching "id", deletes item, returns as array, saves as data
// check to make sure data  has a value then returns response in json, if not gives an error
// * new ObjectId(request.params.id), converts the id string in a MongoDb id
// Authenticated route, verifyToken middleware is called before the async function is executed
// References for this file are from  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
taskRoutes
  .route("/tasks/:id")
  .delete(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db
      .collection("FrankTask")
      .deleteOne({ _id: new ObjectId(request.params.id) });

    response.json(data);
  });

// Start task
// logs a time stamp in the database
taskRoutes
  .route("/tasks/:id/start")
  .put(verifyToken, async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
      $push: { startTime: new Date() },
    };
    let data = await db
      .collection("FrankTask")
      .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
  });

// Pause task
taskRoutes
  .route("/tasks/:id/pause")
  .put(verifyToken, async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
      $push: { pauseTime: { start: new Date() } },
    };
    let data = await db
      .collection("FrankTask")
      .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
  });

// Resume task
// Reference Claude AI, prompt : "Resuming a task, can you explain this in more detail please"
// chekcs to see if any of the pauseTime object DO NOT have a property called "end" if they dont
// it adds that poperty to the object, in this case it will create an object pair {start: date end: date}
// reference Cluade AI prompt " how can i log pause and resume time into mongodb collection"
taskRoutes
  .route("/tasks/:id/resume")
  .put(verifyToken, async (request, response) => {
    console.log("in resume route");

    let db = database.getDb();

    let data = await db.collection("FrankTask").updateOne(
      { _id: new ObjectId(request.params.id) }, // match the document by ID
      { $set: { "pauseTime.$[elem].end": new Date() } }, // update the 'end' field, $ is positional operator
      { arrayFilters: [{ "elem.end": { $exists: false } }] } // filter array elements with no 'end' field
    );
    response.json(data);
  });

// complete task
// logs a end timestamp in the database
taskRoutes
  .route("/tasks/:id/complete")
  .put(verifyToken, async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
      $push: { completeTime: new Date() },
    };
    let data = await db
      .collection("FrankTask")
      .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
  });

// update task status
// updates the status field for the task
taskRoutes
  .route("/tasks/:id/status")
  .put(verifyToken, async (request, response) => {
    // console.log("inside of task status");
    let db = database.getDb();
    let mongoObject = {
      $set: { taskStatus: request.body.taskStatus },
    };
    let data = await db
      .collection("FrankTask")
      .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
  });

// TOTAL TIME updated
taskRoutes
  .route("/tasks/:id/totaltime")
  .put(verifyToken, async (request, response) => {
    console.log("inside of task total time");
    let db = database.getDb();
    let mongoObject = {
      $set: { totalTime: request.body.totalTime },
    };
    let data = await db
      .collection("FrankTask")
      .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
  });

// //notification route
// taskRoutes.route("/tasks").post(verifyToken, async (req, res) => {
//   let db = database.getDb();
//   let mongoObject = {
//     taskName: req.body.taskName,
//     assignedTo: req.body.assignedTo,
//     // Add other fields here
//   };
//   let data = await db.collection("tasks").insertOne(mongoObject);

//   // Emit a notification to all connected users
//   req.io.emit("taskCreated", {
//     message: `New task created: ${mongoObject.taskName}`,
//     task: mongoObject,
//   });

//   res.json(data);
// });

module.exports = taskRoutes;
