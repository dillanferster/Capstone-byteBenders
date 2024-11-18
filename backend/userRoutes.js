/**
 * User Authentication and Registration API
 *
 * This module provides user registration and login routes for a Node.js/Express application using MongoDB.
 * It leverages `bcrypt` for password hashing and `jsonwebtoken` for generating JWT tokens.
 *
 * Author: Gigi Vu
 *
 * Dependencies:
 * - `express`: Framework for handling HTTP requests.
 * - `mongodb`: MongoDB client for interacting with the database.
 * - `bcrypt`: For hashing and comparing passwords securely.
 * - `jsonwebtoken`: For creating signed JWTs for authentication.
 * - `dotenv`: For loading environment variables from a `.env` file.
 *
 * External References:
 * - bcrypt hashing: https://www.npmjs.com/package/bcrypt
 * - JWT token generation: https://www.npmjs.com/package/jsonwebtoken
 * - User registration and login: https://www.mongodb.com/blog/post/node-js-and-mongodb---how-to-connect-with-mongodb-using-node-js
 * - Developing a MERN stack app: https://www.mongodb.com/languages/mern-stack-tutorial
 *
 * Routes:
 * 1. POST `/users`
 *    - POST is a request method used to send data to the server, typically to create or update resources.
 *    - Use case: Registers a new user by hashing the password and storing user information in MongoDB.
 *    - Condition: Prevents registration if the email already exists.
 * 2. POST `/users/login`
 *    - Use Case: Authenticates an existing user by comparing the hashed password. Then generates a JWT token.
 *    - Returns a JWT token if authentication is successful.
 * 3. GET `/users/current`
 *    - Use Case: Retrieves the current logged-in user's information.
 *    - Returns user data excluding sensitive information like password.
 * 4. GET `/users/search`
 *    - Use Case: Searches for users based on name or email.
 *    - Returns filtered user data for participant selection.
 *
 * Environment Variables:
 * - SECRET_KEY: Used to sign JWT tokens.
 *
 * @module userRoutes
 */

const express = require("express"); // import express for router
const database = require("./connect"); // import connection to database from ./connect file
const ObjectId = require("mongodb").ObjectId; // import from mongodb to convert string to object id
const bcrypt = require("bcrypt"); // bcrypt import for password hashing and comparison
const jwt = require("jsonwebtoken"); // import for for token generation and verification
require("dotenv").config({ path: "./.env" }); // import .env file for secret key
const { verifyToken } = require("./middleware/auth"); // import verifyToken function from auth.js

let userRoutes = express.Router(); // create router for user routes
const SALT_ROUNDS = 10; // number of rounds to generate salt for password hashing
const secretKey = process.env.SECRET_KEY;

/**
 * Route #1: POST /users
 *
 * This route handles the user registration process. It performs the following:
 * 1. Hashes the user's password using `bcrypt`.
 * 2. Checks if the email is already registered in the database.
 * 3. If the email is unique, inserts the new user object into the database.
 *
 * @param {Object} request.body - Contains user registration information (fname, lname, email, password, role).
 * @param {Object} response - JSON response containing the newly created user object or error message.
 */
userRoutes.route("/users").post(verifyToken, async (request, response) => {
  let db = database.getDb();

  // Hash is algorithmically turning a password into ciphertext, or an irreversibly obfuscated version of itself that can be stored in a database
  // One-way process, meaning that the original password cannot be retrieved from the hash.
  // Security measure to protect user passwords from being exposed in the event of a data breach.
  // Blocking against the threat of password breaches
  const hash = await bcrypt.hash(request.body.password, SALT_ROUNDS);

  // Check if the email is already taken by querying the users collection
  // findOne() method to find a single document that matches the specified criteria
  const takenEmail = await db
    .collection("users")
    .findOne({ email: request.body.email });

  // If email exists, return a 409 status code with a message
  if (takenEmail) {
    return response
      .status(409)
      .json({ message: "Email already in use. Please enter another email." });
  } else {
    // Prepare the new user object with hashed password and the current date as joinDate
    let mongoObject = {
      fname: request.body.fname,
      lname: request.body.lname,
      email: request.body.email,
      password: hash,
      role: request.body.role,
      joinDate: new Date(),
    };
    // Insert the user object into the MongoDB users collection
    let data = await db.collection("users").insertOne(mongoObject);
    response.json(data);
  }
});

/**
 * Route #2: POST /users/login
 *
 * This route handles user authentication. It performs the following:
 * 1. Checks if the user exists in the database.
 * 2. Compares the provided password with the stored hash.
 * 3. Generates a JWT token if authentication is successful.
 *
 * @param {Object} request.body - Contains login credentials (email, password).
 * @param {Object} response - JSON response containing authentication result and token.
 */
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
      // generate JWT token for this login session
      const token = jwt.sign(user, secretKey, { expiresIn: "1h" }); // token expires in 1 hour
      response.json({ success: true, token, message: "User exists" }); // return token to client
    } else {
      response.json({ success: false, message: "Incorrect password" });
    }
  } else {
    response.json({ success: false, message: "User not found" });
  }
});

/**
 * Route #3: GET /users/current
 *
 * This route retrieves the current user's information. It performs the following:
 * 1. Uses the verifyToken middleware to ensure user is authenticated.
 * 2. Retrieves user information from the database using the ID from the token.
 * 3. Returns user data excluding sensitive information.
 *
 * @param {Object} request - Contains user ID from the verified token.
 * @param {Object} response - JSON response containing user data or error message.
 */
userRoutes
  .route("/users/current")
  .get(verifyToken, async (request, response) => {
    let db = database.getDb();
    try {
      const userId = request.body.user._id;

      const userData = await db.collection("users").findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } } // Exclude password
      );

      if (!userData) {
        return response.status(404).json({ error: "User not found" });
      }

      response.json(userData);
    } catch (error) {
      response.status(500).json({ error: "Failed to fetch user data" });
    }
  });

/**
 * Route #4: GET /users/search
 *
 * This route searches for users based on query parameters. It performs the following:
 * 1. Uses the verifyToken middleware to ensure user is authenticated.
 * 2. Searches users by first name, last name, or email.
 * 3. Returns filtered user data for participant selection.
 *
 * @param {Object} request.query - Contains search parameters.
 * @param {Object} response - JSON response containing matched users or error message.
 */
userRoutes
  .route("/users/search")
  .get(verifyToken, async (request, response) => {
    let db = database.getDb();
    try {
      const query = request.query.query || "";

      const users = await db
        .collection("users")
        .find({
          $or: [
            { fname: { $regex: query, $options: "i" } },
            { lname: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        })
        .project({
          _id: 1,
          fname: 1,
          lname: 1,
          email: 1,
        })
        .limit(10)
        .toArray();

      response.json(users);
    } catch (error) {
      response.status(500).json({ error: "Failed to search users" });
    }
  });

module.exports = userRoutes;
