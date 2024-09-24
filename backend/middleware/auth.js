const jwt = require("jsonwebtoken"); // imports Json Web Token library for token generation
require("dotenv").config({ path: "./.env" }); // imports dotenv , loads the environment variables from .env file

const secretKey = process.env.SECRET_KEY;

// Middleware to verify authentication token
// function to verify token, takes in request, response objects and next callback function
// next: in express - a callback function that, when called, passes control to the next middleware function in the stack.
// gets the authorization header from the request object
// splits the token from the header, saves as token
// if token does not exist, sends a 401 error message: Unauthorized
// verifies the token using jwt.verify, passing in the token and secret key
// if error, sends a 403 error message: Forbidden
// adds the user object to the request body
// move on to next middleware or route handler
function verifyToken(request, response, next) {
  const authHeaders = request.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1]; // if authHeaders is found, extract token based on rules
  console.log("Verify token received:", token); // Gigi Debug log for auth token verification -> remove before production
  if (!token) {
    return response
      .status(401)
      .json({ message: "Authentication token is missing" });
  }

  jwt.verify(token, secretKey, (error, user) => {
    // call verify method on jwt object, passing in token and secret key
    if (error) {
      return response.status(403).json({ message: "Invalid token" }); // 403: token exist but invalid
    }

    request.body.user = user; // add user object to request body
    next(); // pass control to next middleware or route handler
  });
}

module.exports = { verifyToken };
