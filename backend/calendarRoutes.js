const express = require("express");
const database = require("./connect");
const { verifyToken } = require("./middleware/auth");
require("dotenv").config({ path: "./.env" });

let calendarRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;

// Read all events / GET - Modified to only get user's events
calendarRoutes.route("/events").get(verifyToken, async (request, response) => {
  let db = database.getDb();
  try {
    // Get user ID from the verified token
    const userId = request.body.user._id;

    let data = await db
      .collection("calendar")
      .find({ assignedTo: userId })
      .toArray();

    response.json(data || []);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch events" });
  }
});

// Read one event / GET
calendarRoutes
  .route("/events/:id")
  .get(verifyToken, async (request, response) => {
    let db = database.getDb();
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

// Create event / POST - Modified to include assignedTo
calendarRoutes.route("/events").post(verifyToken, async (request, response) => {
  let db = database.getDb();
  try {
    let eventObject = {
      title: request.body.title,
      start: request.body.start,
      end: request.body.end,
      description: request.body.description,
      meetingLink: request.body.meetingLink,
      participants: request.body.participants,
      assignedTo: request.body.user._id, // Add user ID from token
    };

    let data = await db.collection("calendar").insertOne(eventObject);
    response.json(data);
  } catch (error) {
    console.log("IN CATCH BLOCK: ", error);
    response.status(500).json({ error: "Failed to create event" });
  }
});

// Update event / PUT
calendarRoutes
  .route("/events/:id")
  .put(verifyToken, async (request, response) => {
    let db = database.getDb();
    try {
      let eventObject = {
        $set: {
          title: request.body.title,
          start: request.body.start,
          end: request.body.end,
          description: request.body.description,
          meetingLink: request.body.meetingLink,
          participants: request.body.participants,
          // lastModified: new Date(),
          // modifiedBy: request.user.id, // Assuming user info is added by auth middleware
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
    let db = database.getDb();
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

// Get events by date range / GET - Modified to include user filter
calendarRoutes
  .route("/events/range")
  .get(verifyToken, async (request, response) => {
    let db = database.getDb();
    try {
      const { start, end } = request.query;
      const userId = request.body.user._id;

      let data = await db
        .collection("calendar")
        .find({
          assignedTo: userId,
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
    let db = database.getDb();
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

module.exports = calendarRoutes;
