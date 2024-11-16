/**
 *
 * This file creates all of the project routes
 *
 *  Exports as  projectRoutes
 *
 *  References for this connection file are from
 *  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
 *
 *  */

import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// imports dotenv , loads the environment variables from .env file
dotenv.config({ path: "./.env" });

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// reference  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database;

// creates initial connect to database, uses the client from above and connects to "Projects db"
export const connectToServer = () => {
  database = client.db("Capstone");
};

// returns the database object , can only call after the connect server runs
export const getDb = () => {
  return database;
};

// Export both functions as default export for backwards compatibility
export default {
  connectToServer,
  getDb,
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
