const mongoose = require('mongoose');

const specificRatingsSchema = new mongoose.Schema(
  {
    cleanliness: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    checkIn: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
  },
  { _id: false }
);

const accommodationSchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      required: [true, 'Accommodation type is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    guests: { type: Number, default: 1 },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    amenities: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    host: { type: String, trim: true },
    // Reference to the User who owns this listing
    host_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Host id is required'],
    },
    weeklyDiscount: { type: Number, default: 0 },
    cleaningFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    occupancyTaxes: { type: Number, default: 0 },
    enhancedCleaning: { type: Boolean, default: false },
    selfCheckIn: { type: Boolean, default: false },
    freeCancellation: { type: Boolean, default: false },
    instantBook: { type: Boolean, default: false },
    description: { type: String, trim: true },
    specificRatings: {
      type: specificRatingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Accommodation', accommodationSchema);
