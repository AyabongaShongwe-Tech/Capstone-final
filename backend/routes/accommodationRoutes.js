const express = require('express');
const router = express.Router();
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require('../controllers/accommodationController');
const { protect, authorize } = require('../middleware/auth');

// Public reads
router.get('/', getAccommodations);
router.get('/:id', getAccommodationById);

// Only authenticated hosts can create listings
router.post('/', protect, authorize('host'), createAccommodation);

// Only the owning host can update (ownership checked in the controller)
router.put('/:id', protect, authorize('host'), updateAccommodation);

// Only the owning host can delete (ownership checked in the controller)
router.delete('/:id', protect, authorize('host'), deleteAccommodation);

module.exports = router;
