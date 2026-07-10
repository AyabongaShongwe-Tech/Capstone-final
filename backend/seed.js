require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');
const Reservation = require('./models/Reservation');

// Seeds the database with sample users and accommodations for local testing.
// Run with: npm run seed
const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Accommodation.deleteMany({}),
      Reservation.deleteMany({}),
    ]);

    // Create users (passwords are hashed by the User pre-save hook)
    const guest = await User.create({
      username: 'John Doe',
      password: 'password123',
      role: 'user',
    });

    const host = await User.create({
      username: 'Jane Doe',
      password: 'password321',
      role: 'host',
    });

    // Create a sample accommodation owned by the host
    const accommodation = await Accommodation.create({
      images: ['/images/new-york-lady-of-liberty.jpg'],
      type: 'Entire apartment',
      location: 'New York',
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['wifi', 'kitchen', 'free parking'],
      rating: 4.5,
      reviews: 320,
      price: 320,
      title: 'Modern Apartment in New York',
      host: host.username,
      host_id: host._id,
      weeklyDiscount: 0,
      cleaningFee: 50,
      serviceFee: 50,
      occupancyTaxes: 30,
      enhancedCleaning: true,
      selfCheckIn: true,
      description: 'Stay in the heart of New York City...',
      specificRatings: {
        cleanliness: 4.8,
        communication: 4.7,
        checkIn: 4.9,
        accuracy: 4.6,
        location: 4.9,
        value: 4.5,
      },
    });

    // Create a sample reservation
    await Reservation.create({
      accommodation: accommodation._id,
      user: guest._id,
      host: host._id,
      checkIn: new Date('2026-08-01'),
      checkOut: new Date('2026-08-05'),
      guests: 2,
      totalPrice: 320 * 4 + 50 + 50 + 30,
      status: 'confirmed',
    });

    console.log('Database seeded successfully.');
    console.log(`  Guest login: "${guest.username}" / password123`);
    console.log(`  Host  login: "${host.username}" / password321`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
