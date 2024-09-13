const express = require("express");

const database = require("./connect");

let projectRoutes = express.Router();

// imports from mongodb to convert string to object id
const ObjectId = require("mongodb").ObjectId;

// Read all
// connects to database via ./connect file module function
// goes into connection and finds all, returns as array
// check to make sure resposone has a value then returns in json
projectRoutes.route("/projects").get(async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("Dillan").find({}).toArray();
  if (data.length > 0) {
    response.json(data);
  } else {
    throw new Error("data was not found");
  }
});

// Read one
// connects to database via ./connect file module function
// goes into connection and finds item that matches the id
// check to make sure resposone has a value then returns in json
projectRoutes.route("/projects/:id").get(async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("Dillan")
    .findOne({ _id: new ObjectId(request.params.id) });
  if (Object.keys(data.length > 0)) {
    response.json(data);
  } else {
    throw new Error("data was not found");
  }
});

// create one
// connects to database via ./connect file module function
// makes a post with an object
projectRoutes.route("/projects").post(async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    projectName: request.body.projectName,
    projectDesc: request.body.projectDesc,
    assignedTo: request.body.assignedTo,
    dateCreated: request.body.dateCreated,
  };
  let data = await db.collection("Dillan").insertOne(mongoObject);
  response.json(data);
});

// update one
// connects to database via ./connect file module function
//
projectRoutes.route("/projects/:id").put(async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    $set: {
      projectName: request.body.projectName,
      projectDesc: request.body.projectDesc,
      assignedTo: request.body.assignedTo,
      dateCreated: request.body.dateCreated,
    },
  };
  let data = await db
    .collection("Dillan")
    .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
  response.json(data);
});

// delete one
// connects to database via ./connect file module function
projectRoutes.route("/projects/:id").delete(async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("Dillan")
    .deleteOne({ _id: new ObjectId(request.params.id) });

  response.json(data);
});

module.exports = projectRoutes;
