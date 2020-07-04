const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// Middleware
const ErrorHandler = require('./middleware/error');

// Extra Tools
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env'});

// Connect to DB
connectDB();

// Route files
const auth = require('./routes/auth');
const record = require('./routes/record');

// Define app
const app = express();

// Body Parser
app.use(express.json());

// Define port from process
const PORT = process.env.PORT || 5000;

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', record);

// Error Handler
app.use(ErrorHandler);

// Serve
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV}`.yellow.bold));