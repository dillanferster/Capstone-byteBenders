const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(express.json());
// ... rest of your backend code 