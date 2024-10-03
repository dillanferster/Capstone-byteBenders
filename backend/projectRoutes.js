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
let projectRoutes = express.Router();

// imports from mongodb to convert string to object id
const ObjectId = require("mongodb").ObjectId;

// Read all / GET
// async callback function, passes in HTTP request and response object
// uses the express projectRoutes object to set the GET route as "/projects"
// uses the getDB function from the ./connect file to return the DB
// awaits, goes into DB collection "projects" and finds all, returns as array, saves as data
// check to make sure data  has a value then returns response in json, if not gives an error
// Authenticated route, verifyToken middleware is called before the async function is executed
projectRoutes.route("/projects").get(verifyToken, async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("Dillan").find({}).toArray();

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
projectRoutes
  .route("/projects/:id")
  .get(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db
      .collection("Dillan")
      .findOne({ _id: new ObjectId(request.params.id) });
    if (data) {
      response.json(data);
    } else {
      throw new Error("data was not found");
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
projectRoutes
  .route("/projects")
  .post(verifyToken, async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
      projectName: request.body.projectName,
      projectDesc: request.body.projectDesc,
      caseId: request.body.caseId,
      dataClassification: request.body.dataClassification,
      assignedTo: request.body.assignedTo,
      projectStatus: request.body.projectStatus,
      quickBaseLink: request.body.quickBaseLink,
      dateCreated: request.body.dateCreated,
    };
    let data = await db.collection("Dillan").insertOne(mongoObject);
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
projectRoutes
  .route("/projects/:id")
  .put(verifyToken, async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
      $set: {
        projectName: request.body.projectName,
        projectDesc: request.body.projectDesc,
        caseId: request.body.caseId,
        dataClassification: request.body.dataClassification,
        assignedTo: request.body.assignedTo,
        projectStatus: request.body.projectStatus,
        quickBaseLink: request.body.quickBaseLink,
        dateCreated: request.body.dateCreated,
      },
    };
    let data = await db
      .collection("Dillan")
      .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
  });

/// UPDATE PROJECT TASK ARRAY
// takes in the project id and task id
// finds the matching project in the database
// adds the task id to the TaskIdForProject array
// Reference: https://www.mongodb.com/docs/manual/reference/operator/update/push/
projectRoutes
  .route("/projectsupdate/:id")
  .put(verifyToken, async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
      $push: { TaskIdForProject: request.body.taskId },
    };
    let data = await db
      .collection("Dillan")
      .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
  });

// DELETE TASK FROM PROJECT TASK ARRAY
// Reference: https://www.mongodb.com/docs/manual/reference/operator/update/push/
projectRoutes
  .route("/projectstaskdelete/:id")
  .delete(verifyToken, async (request, response) => {
    let db = database.getDb();

    console.log("Project ID INSIDE ROUTE:", request.params.id);
    console.log("Task ID to delete INSIDE ROUTE:", request.body.taskId);

    let mongoObject = {
      $pull: { TaskIdForProject: request.body.taskId },
    };
    let data = await db
      .collection("Dillan")
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
projectRoutes
  .route("/projects/:id")
  .delete(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db
      .collection("Dillan")
      .deleteOne({ _id: new ObjectId(request.params.id) });

    response.json(data);
  });

module.exports = projectRoutes;
