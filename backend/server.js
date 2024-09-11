// this is the equivalent of import on the front end, it runs the entire file that the module.export is in though
const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const posts = require("./postRoutes");

const app = express();

// specifies what port
const PORT = 3000;

// deals with cors domain stuff
app.use(cors());

// formats everything into json
app.use(express.json());

//mounting routes, makes posts available to the rest of the app
app.use(posts);

// creates the server
// callback function runs the connect file once connection is established
app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`server is running on port ${PORT}`);
});
