require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Core middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend ka exact origin — "*" NAHI
    credentials: true,               // cookies allow karne ke liye zaroori
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded images statically (optional — supports the /images paths in listings)
app.use('/images', express.static('public/images'));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Airbnb Clone API is running' });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reservations', reservationRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
