require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/db');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
