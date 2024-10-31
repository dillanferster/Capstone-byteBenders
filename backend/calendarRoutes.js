// calendarRoutes.js
import express from "express";
import { getDb } from "./connect.js"; // Note the .js extension
import { verifyToken } from "./middleware/auth.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const calendarRoutes = express.Router();

// Read all events / GET
calendarRoutes.route("/events").get(verifyToken, async (request, response) => {
  let db = getDb();
  try {
    let data = await db.collection("calendar").find({}).toArray();
    if (data.length > 0) {
      response.json(data);
    } else {
      response.json([]); // Return empty array if no events found
    }
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch events" });
  }
});

// Read one event / GET
calendarRoutes
  .route("/events/:id")
  .get(verifyToken, async (request, response) => {
    let db = getDb();
    try {
      let data = await db
        .collection("calendar")
        .findOne({ _id: new ObjectId(request.params.id) });
      if (data) {
        response.json(data);
      } else {
        response.status(404).json({ error: "Event not found" });
      }
    } catch (error) {
      response.status(500).json({ error: "Failed to fetch event" });
    }
  });

// Create event / POST
calendarRoutes.route("/events").post(verifyToken, async (request, response) => {
  let db = getDb();
  try {
    let eventObject = {
      title: request.body.title,
      start: request.body.start,
      end: request.body.end,
      description: request.body.description,
      meetingLink: request.body.meetingLink,
      participants: request.body.participants,
    };
    let data = await db.collection("calendar").insertOne(eventObject);
    response.json(data);
  } catch (error) {
    response.status(500).json({ error: "Failed to create event" });
  }
});

// Update event / PUT
calendarRoutes
  .route("/events/:id")
  .put(verifyToken, async (request, response) => {
    let db = getDb();
    try {
      let eventObject = {
        $set: {
          title: request.body.title,
          start: request.body.start,
          end: request.body.end,
          description: request.body.description,
          meetingLink: request.body.meetingLink,
          participants: request.body.participants,
        },
      };
      let data = await db
        .collection("calendar")
        .updateOne({ _id: new ObjectId(request.params.id) }, eventObject);

      if (data.matchedCount === 0) {
        response.status(404).json({ error: "Event not found" });
      } else {
        response.json(data);
      }
    } catch (error) {
      response.status(500).json({ error: "Failed to update event" });
    }
  });

// Delete event / DELETE
calendarRoutes
  .route("/events/:id")
  .delete(verifyToken, async (request, response) => {
    let db = getDb();
    try {
      let data = await db
        .collection("calendar")
        .deleteOne({ _id: new ObjectId(request.params.id) });

      if (data.deletedCount === 0) {
        response.status(404).json({ error: "Event not found" });
      } else {
        response.json(data);
      }
    } catch (error) {
      response.status(500).json({ error: "Failed to delete event" });
    }
  });

// Get events by date range / GET
calendarRoutes
  .route("/events/range")
  .get(verifyToken, async (request, response) => {
    let db = getDb();
    try {
      const { start, end } = request.query;
      let data = await db
        .collection("calendar")
        .find({
          start: { $gte: new Date(start) },
          end: { $lte: new Date(end) },
        })
        .toArray();

      response.json(data);
    } catch (error) {
      response
        .status(500)
        .json({ error: "Failed to fetch events by date range" });
    }
  });

// Get events by participant / GET
calendarRoutes
  .route("/events/participant/:email")
  .get(verifyToken, async (request, response) => {
    let db = getDb();
    try {
      let data = await db
        .collection("calendar")
        .find({ participants: request.params.email })
        .toArray();

      response.json(data);
    } catch (error) {
      response
        .status(500)
        .json({ error: "Failed to fetch events by participant" });
    }
  });

export default calendarRoutes;
