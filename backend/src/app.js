const express = require('express');
const cookierParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookierParser());

// Test Route
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use('/api/auth', authRoutes);

module.exports = app;
