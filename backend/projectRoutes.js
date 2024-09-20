const express = require("express");
const database = require("./connect");
const jwt = require("jsonwebtoken"); // for token generation
require("dotenv").config({ path: "./.env" });

let projectRoutes = express.Router();

// imports from mongodb to convert string to object id
const ObjectId = require("mongodb").ObjectId;
const secretKey = process.env.SECRET_KEY;

// Read all
// connects to database via ./connect file module function
// goes into connection and finds all, returns as array
// check to make sure resposone has a value then returns in json
projectRoutes.route("/projects").get(verifyToken, async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("projects").find({}).toArray();
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
projectRoutes
  .route("/projects/:id")
  .get(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db
      .collection("projects")
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
projectRoutes
  .route("/projects")
  .post(verifyToken, async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
      projectName: request.body.projectName,
      projectDesc: request.body.projectDesc,
      assignedTo: request.body.assignedTo,
      dateCreated: request.body.dateCreated,
    };
    let data = await db.collection("projects").insertOne(mongoObject);
    response.json(data);
  });

// update one
// connects to database via ./connect file module function
//
projectRoutes
  .route("/projects/:id")
  .put(verifyToken, async (request, response) => {
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
      .collection("projects")
      .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
  });

// delete one
// connects to database via ./connect file module function
projectRoutes
  .route("/projects/:id")
  .delete(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db
      .collection("projects")
      .deleteOne({ _id: new ObjectId(request.params.id) });

    response.json(data);
  });

// verify authentication token
function verifyToken(request, response, next) {
  const authHeaders = request.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) {
    return response
      .status(401)
      .json({ message: "Authentication token is missing" });
  }

  jwt.verify(token, secretKey, (error, user) => {
    if (error) {
      return response.status(403).json({ message: "Invalid token" });
    }

    request.body.user = user;
    next();
  });
}

module.exports = projectRoutes;
