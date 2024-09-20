const express = require("express");
const database = require("./connect");
// imports from mongodb to convert string to object id
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt"); // for password hashing
const jwt = require("jsonwebtoken"); // for token generation
require("dotenv").config({ path: "./.env" });

let userRoutes = express.Router();
const SALT_ROUNDS = 10;
const secretKey = process.env.SECRET_KEY;
// Read all
// connects to database via ./connect file module function
// goes into connection and finds all, returns as array
// check to make sure resposone has a value then returns in json
userRoutes.route("/users").get(async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("users").find({}).toArray();
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
userRoutes.route("/users/:id").get(async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("users")
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
userRoutes.route("/users").post(async (request, response) => {
  let db = database.getDb();
  const hash = await bcrypt.hash(request.body.password, SALT_ROUNDS);

  const takenEmail = await db
    .collection("users")
    .findOne({ email: request.body.email });
  console.log(takenEmail);

  if (takenEmail) {
    response.json({ message: "Email already taken" });
    return;
  } else {
    let mongoObject = {
      fname: request.body.fname,
      lname: request.body.lname,
      email: request.body.email,
      password: hash,
      joinDate: new Date(),
    };
    let data = await db.collection("users").insertOne(mongoObject);
    response.json(data);
    console.log(response);
  }
});

// update one
// connects to database via ./connect file module function
userRoutes.route("/users/:id").put(async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    $set: {
      fname: request.body.fname,
      lname: request.body.lname,
      email: request.body.email,
      password: request.body.password,
      joinDate: request.body.joinDate,
    },
  };
  let data = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
  response.json(data);
});

// verify user login
// connects to database via ./connect file module function
// goes into connection and finds item that matches the email
userRoutes.route("/users/login").post(async (request, response) => {
  let db = database.getDb();
  const user = await db
    .collection("users")
    .findOne({ email: request.body.email });

  if (user) {
    let confirmation = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (confirmation) {
      const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
      response.json({ success: true, token });
    } else {
      response.json({ success: false, message: "Incorrect password" });
    }
  } else {
    response.json({ success: false, message: "User not found" });
  }
});

module.exports = userRoutes;
