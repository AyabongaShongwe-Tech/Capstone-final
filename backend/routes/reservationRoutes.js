const express = require('express');
const router = express.Router();
const {
  createReservation,
  getHostReservations,
  getUserReservations,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');

// All reservation routes require authentication.
router.post('/', protect, createReservation);

// Specific routes must be declared before the /:id route to avoid conflicts.
router.get('/host', protect, getHostReservations);
router.get('/user', protect, getUserReservations);

router.delete('/:id', protect, deleteReservation);

module.exports = router;
