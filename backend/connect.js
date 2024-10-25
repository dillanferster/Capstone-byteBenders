/**
 *
 * This file creates all of the project routes
 *
 *  Exports as  projectRoutes
 *
 *  References for this connection file are from
 * c
 *
 *  */

const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config({ path: "./.env" }); // imports dotenv , loads the environment variables from .env file

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// reference  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
////

let database;

// can use require() to access one module.export
// making the connection the to the database
module.exports = {
  // creates initail connect to database, uses the client from above and connects to "Projects db"
  connectToServer: () => {
    database = client.db("Capstone");
  },
  // returns the database object , can only call after the connect server runs
  getDb: () => {
    return database;
  },
};

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
