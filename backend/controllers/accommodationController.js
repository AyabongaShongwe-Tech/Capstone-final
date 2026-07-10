const Accommodation = require('../models/Accommodation');
const { uploadImages } = require('../config/cloudinary');

// @desc    Create a new accommodation listing
// @route   POST /api/accommodations
// @access  Private (host only)
const createAccommodation = async (req, res) => {
  try {
    // Upload any provided images to Cloudinary and store the hosted URLs.
    const images = await uploadImages(req.body.images);

    // The authenticated host owns this listing.
    const accommodation = await Accommodation.create({
      ...req.body,
      images,
      host_id: req.user._id,
      host: req.body.host || req.user.username,
    });

    return res.status(201).json(accommodation);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Failed to create accommodation', error: error.message });
  }
};

// @desc    Update an accommodation listing by id
// @route   PUT /api/accommodations/:id
// @access  Private (owning host only)
const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Only the host who created the listing may update it.
    if (accommodation.host_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this accommodation' });
    }

    // Never let the client reassign ownership.
    const { host_id, host, ...updates } = req.body;

    // If new images are supplied, upload them to Cloudinary first.
    if (updates.images !== undefined) {
      updates.images = await uploadImages(updates.images);
    }

    Object.assign(accommodation, updates);
    const updated = await accommodation.save();

    return res.status(200).json(updated);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Failed to update accommodation', error: error.message });
  }
};

// @desc    Get all accommodation listings
// @route   GET /api/accommodations
// @access  Public
const getAccommodations = async (req, res) => {
  try {
    // Optional filtering via query params: ?location=&guests=&type=
    const filter = {};

    // Case-insensitive partial match so "new york" also matches "New York".
    if (req.query.location) {
      filter.location = { $regex: req.query.location.trim(), $options: 'i' };
    }

    // Return places that can host AT LEAST the requested number of guests.
    if (req.query.guests) {
      const guests = Number(req.query.guests);
      if (!Number.isNaN(guests) && guests > 0) {
        filter.guests = { $gte: guests };
      }
    }

    if (req.query.type) filter.type = req.query.type;

    const accommodations = await Accommodation.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json(accommodations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single accommodation listing by id
// @route   GET /api/accommodations/:id
// @access  Public
const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    return res.status(200).json(accommodation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an accommodation listing
// @route   DELETE /api/accommodations/:id
// @access  Private (owning host only)
const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Only the host who created the listing may delete it.
    if (accommodation.host_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this accommodation' });
    }

    await accommodation.deleteOne();
    return res
      .status(200)
      .json({ message: 'Accommodation deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
};
