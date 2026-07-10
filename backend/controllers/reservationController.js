const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const { accommodation, checkIn, checkOut, guests, totalPrice,userName } = req.body;

    if (!accommodation || !checkIn || !checkOut) {
      return res.status(400).json({
        message: 'accommodation, checkIn and checkOut are required',
      });
    }

    // Validate that the accommodation exists and grab its host.
    const listing = await Accommodation.findById(accommodation);
    if (!listing) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res
        .status(400)
        .json({ message: 'checkOut must be after checkIn' });
    }

    // Prevent the same user from reserving the same property more than once
    // (ignore reservations they have already cancelled).
    const existingReservation = await Reservation.findOne({
      accommodation: listing._id,
      user: req.user._id,
      status: { $ne: 'cancelled' },
    });
    if (existingReservation) {
      return res.status(409).json({
        message: 'You have already reserved this property',
      });
    }

    const reservation = await Reservation.create({
      accommodation: listing._id,
      user: req.user._id,
      userName,
      host: listing.host_id,
      checkIn,
      checkOut,
      guests: guests || 1,
      // Fall back to the listing price if the client did not supply a total.
      totalPrice: totalPrice != null ? totalPrice : listing.price,
    });

    return res.status(201).json(reservation);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Failed to create reservation', error: error.message });
  }
};

// @desc    Get all reservations for the authenticated host's listings
// @route   GET /api/reservations/host
// @access  Private (host)
const getHostReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ host: req.user._id })
      .populate('accommodation', 'title location price images')
      .populate('user', 'username role')
      .sort({ createdAt: -1 });

    return res.status(200).json(reservations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all reservations made by the authenticated user
// @route   GET /api/reservations/user
// @access  Private
const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('accommodation', 'title location price images')
      .populate('host', 'username role')
      .sort({ createdAt: -1 });

    return res.status(200).json(reservations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private (the guest who booked or the owning host)
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Allow the booking user or the host of the accommodation to cancel.
    const userId = req.user._id.toString();
    const isOwner =
      reservation.user.toString() === userId ||
      reservation.host.toString() === userId;

    if (!isOwner) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this reservation' });
    }

    await reservation.deleteOne();
    return res
      .status(200)
      .json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReservation,
  getHostReservations,
  getUserReservations,
  deleteReservation,
};
