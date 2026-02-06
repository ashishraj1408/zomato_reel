const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes')
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))

// Test Route
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth/food', foodRoutes);
app.use('/api/v1/food-partner', foodPartnerRoutes);


module.exports = app;
