require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');

// Frontend listings data — added to the accommodations collection.
// Run with: npm run seed:listings
const LISTINGS = [
  { title: 'Bordeaux Getaway', location: 'Bordeaux', type: 'Entire Home', maxGuests: 6, beds: 5, baths: 3, amenities: ['Wifi', 'Kitchen', 'Free Parking'], rating: 5.0, reviews: 318, price: 325, image: '/images/listings/bordeaux-getaway.jpg', freeCancellation: true, instantBook: true },
  { title: 'Charming Waterfront Condo', location: 'Bordeaux', type: 'Entire Home', maxGuests: 6, beds: 5, baths: 3, amenities: ['Wifi', 'Kitchen', 'Free Parking'], rating: 5.0, reviews: 318, price: 200, image: '/images/listings/waterfront-condo.jpg', freeCancellation: true, instantBook: false },
  { title: 'Historic City Center Home', location: 'Bordeaux', type: 'Entire Home', maxGuests: 6, beds: 5, baths: 3, amenities: ['Wifi', 'Kitchen', 'Free Parking'], rating: 5.0, reviews: 318, price: 125, image: '/images/listings/city-center.jpg', freeCancellation: false, instantBook: true },
  { title: 'Cozy Vineyard Cottage', location: 'Bordeaux', type: 'Private Room', maxGuests: 2, beds: 1, baths: 1, amenities: ['Wifi', 'Kitchen'], rating: 4.8, reviews: 142, price: 95, image: '/images/listings/vineyard-cottage.jpg', freeCancellation: true, instantBook: true },
  { title: 'Luxe Riverside Penthouse', location: 'Bordeaux', type: 'Entire Home', maxGuests: 8, beds: 4, baths: 3, amenities: ['Wifi', 'Kitchen', 'Free Parking', 'Pool', 'AC'], rating: 4.9, reviews: 210, price: 480, image: '/images/listings/riverside-penthouse.jpg', freeCancellation: false, instantBook: false },
  { title: 'Boutique Hotel Suite', location: 'Bordeaux', type: 'Hotel Room', maxGuests: 2, beds: 1, baths: 1, amenities: ['Wifi', 'AC'], rating: 4.7, reviews: 512, price: 160, image: '/images/listings/hotel-suite.jpg', freeCancellation: true, instantBook: true },
  { title: 'Budget Room Near Old Town', location: 'Bordeaux', type: 'Shared Room', maxGuests: 1, beds: 1, baths: 1, amenities: ['Wifi'], rating: 4.5, reviews: 88, price: 45, image: '/images/listings/budget-room.jpg', freeCancellation: false, instantBook: true },
  { title: 'Modern Loft with Balcony', location: 'Bordeaux', type: 'Entire Home', maxGuests: 4, beds: 2, baths: 2, amenities: ['Wifi', 'Kitchen', 'AC'], rating: 4.9, reviews: 267, price: 275, image: '/images/listings/modern-loft.jpg', freeCancellation: true, instantBook: false },
  { title: 'Manhattan Skyline Apartment', location: 'New york', type: 'Entire Home', maxGuests: 4, beds: 2, baths: 2, amenities: ['Wifi', 'Kitchen', 'AC'], rating: 4.8, reviews: 430, price: 350, image: '/images/listings/manhattan.jpg', freeCancellation: true, instantBook: true },
  { title: 'Charming Montmartre Studio', location: 'Paris', type: 'Private Room', maxGuests: 2, beds: 1, baths: 1, amenities: ['Wifi', 'Kitchen'], rating: 4.9, reviews: 389, price: 180, image: '/images/listings/paris-studio.jpg', freeCancellation: false, instantBook: true },
  { title: 'Shibuya Neon Loft', location: 'Tokoyo', type: 'Entire Home', maxGuests: 3, beds: 2, baths: 1, amenities: ['Wifi', 'AC'], rating: 4.7, reviews: 205, price: 220, image: '/images/listings/tokyo-loft.jpg', freeCancellation: true, instantBook: false },
  { title: 'Phuket Beach Villa', location: 'Thailand', type: 'Entire Home', maxGuests: 8, beds: 4, baths: 4, amenities: ['Wifi', 'Kitchen', 'Free Parking', 'Pool'], rating: 5.0, reviews: 156, price: 300, image: '/images/listings/thailand-villa.jpg', freeCancellation: true, instantBook: true },
];

const seedListings = async () => {
  try {
    await connectDB();

    // Every accommodation needs an owning host. Reuse a host user, or create one.
    let host = await User.findOne({ role: 'host' });
    if (!host) {
      host = await User.create({
        username: 'Jane Doe',
        password: 'password321',
        role: 'host',
      });
    }

    // Map the frontend shape to the Accommodation schema.
    const docs = LISTINGS.map((l) => ({
      title: l.title,
      location: l.location,
      type: l.type,
      guests: l.maxGuests,
      bedrooms: l.beds,
      bathrooms: l.baths,
      amenities: l.amenities,
      rating: l.rating,
      reviews: l.reviews,
      price: l.price,
      images: [l.image],
      freeCancellation: l.freeCancellation,
      instantBook: l.instantBook,
      host: host.username,
      host_id: host._id,
    }));

    // Skip titles that already exist so re-running doesn't create duplicates.
    const existingTitles = new Set(
      (await Accommodation.find({ title: { $in: docs.map((d) => d.title) } }, 'title')).map(
        (a) => a.title
      )
    );
    const toInsert = docs.filter((d) => !existingTitles.has(d.title));

    if (toInsert.length === 0) {
      console.log('All listings already exist — nothing to add.');
    } else {
      await Accommodation.insertMany(toInsert);
      console.log(`Inserted ${toInsert.length} accommodation(s).`);
      if (existingTitles.size > 0) {
        console.log(`Skipped ${existingTitles.size} that already existed.`);
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding listings failed:', error.message);
    process.exit(1);
  }
};

seedListings();
