require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const isProd = process.env.NODE_ENV === "production";

// Core middleware
app.use(
  cors({
    origin: isProd ? true : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded images statically (optional — supports the /images paths in listings)
app.use('/images', express.static('public/images'));

// Health check (moved off "/" so it doesn't intercept the deployed frontend's homepage)
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Airbnb Clone API is running' });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reservations', reservationRoutes);

// Serve the built React frontend in production (single combined app)
if (isProd) {
  const frontendDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDist));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

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
