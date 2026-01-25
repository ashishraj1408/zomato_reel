const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/food', foodRoutes);


module.exports = app;
