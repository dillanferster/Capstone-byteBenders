/**
 * Calendar Events API
 *
 * This module provides routes for managing calendar events in a Node.js/Express application using MongoDB.
 * It handles CRUD operations for events and manages participant data.
 *
 * Author: Gigi Vu
 *
 * Dependencies:
 * - `express`: Framework for handling HTTP requests
 * - `mongodb`: MongoDB client for database operations
 * - `jsonwebtoken`: For token verification through middleware
 *
 * Routes:
 * 1. GET `/events`
 *    - Retrieves all events where the authenticated user is a participant
 * 2. GET `/events/:id`
 *    - Retrieves a specific event by ID
 * 3. POST `/events`
 *    - Creates a new event with the authenticated user as creator
 * 4. PUT `/events/:id`
 *    - Updates an existing event
 * 5. DELETE `/events/:id`
 *    - Deletes an event
 *
 * @module calendarRoutes
 */

const express = require("express");
const database = require("./connect");
const { verifyToken } = require("./middleware/auth");
require("dotenv").config({ path: "./.env" });
const ObjectId = require("mongodb").ObjectId;

let calendarRoutes = express.Router();

/**
 * GET /events
 * Retrieves all events where the current user is a participant.
 */
calendarRoutes.route("/events").get(verifyToken, async (request, response) => {
  let db = database.getDb();
  try {
    // Get user ID from the verified token
    const userId = request.body.user._id;

    let data = await db
      .collection("calendar")
      .find({
        "participants._id": userId,
      })
      .sort({ start: 1 })
      .toArray();

    response.json(data || []);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch events" });
  }
});

/**
 * GET /events/:id
 * Retrieves a specific event by ID.
 */
calendarRoutes
  .route("/events/:id")
  .get(verifyToken, async (request, response) => {
    let db = database.getDb();
    try {
      let data = await db
        .collection("calendar")
        .findOne({ _id: new ObjectId(request.params.id) });

      if (!data) {
        return response.status(404).json({ error: "Event not found" });
      }
      response.json(data);
    } catch (error) {
      response.status(500).json({ error: "Failed to fetch event" });
    }
  });

/**
 * POST /events
 * Creates a new event with the current user as creator and first participant.
 */
calendarRoutes.route("/events").post(verifyToken, async (request, response) => {
  let db = database.getDb();
  try {
    const creator = {
      _id: request.body.user._id,
      fname: request.body.user.fname,
      lname: request.body.user.lname,
      email: request.body.user.email,
    };

    // Ensure creator is first in participants list
    const participants = request.body.participants || [];
    if (!participants.some((p) => p._id === creator._id)) {
      participants.unshift(creator);
    }

    let eventObject = {
      title: request.body.title,
      start: request.body.start,
      end: request.body.end,
      description: request.body.description,
      meetingLink: request.body.meetingLink,
      participants: participants,
      createdBy: creator._id,
      createdAt: new Date(),
    };

    let data = await db.collection("calendar").insertOne(eventObject);
    response.json(data);
  } catch (error) {
    console.error("Error creating event:", error);
    response.status(500).json({ error: "Failed to create event" });
  }
});

/**
 * PUT /events/:id
 * Updates an existing event while maintaining the creator in participants.
 */
calendarRoutes
  .route("/events/:id")
  .put(verifyToken, async (request, response) => {
    let db = database.getDb();
    try {
      const creator = {
        _id: request.body.user._id,
        fname: request.body.user.fname,
        lname: request.body.user.lname,
        email: request.body.user.email,
      };

      // Ensure creator stays in participants list
      const participants = request.body.participants || [];
      if (!participants.some((p) => p._id === creator._id)) {
        participants.unshift(creator);
      }

      let eventObject = {
        $set: {
          title: request.body.title,
          start: request.body.start,
          end: request.body.end,
          description: request.body.description,
          meetingLink: request.body.meetingLink,
          participants: participants,
          updatedAt: new Date(),
        },
      };

      let data = await db
        .collection("calendar")
        .updateOne({ _id: new ObjectId(request.params.id) }, eventObject);

      if (data.matchedCount === 0) {
        return response.status(404).json({ error: "Event not found" });
      }
      response.json(data);
    } catch (error) {
      response.status(500).json({ error: "Failed to update event" });
    }
  });

/**
 * DELETE /events/:id
 * Deletes an event by ID.
 */
calendarRoutes
  .route("/events/:id")
  .delete(verifyToken, async (request, response) => {
    let db = database.getDb();
    try {
      let data = await db
        .collection("calendar")
        .deleteOne({ _id: new ObjectId(request.params.id) });

      if (data.deletedCount === 0) {
        return response.status(404).json({ error: "Event not found" });
      }
      response.json(data);
    } catch (error) {
      response.status(500).json({ error: "Failed to delete event" });
    }
  });

module.exports = calendarRoutes;
