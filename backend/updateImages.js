require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Accommodation = require('./models/Accommodation');

// Gives every accommodation 5 placeholder photos from Lorem Picsum.
// Seeded by the listing id so each place gets its own consistent set of images.
// Run with: npm run update:images
const updateImages = async () => {
  try {
    await connectDB();

    const accommodations = await Accommodation.find({});
    console.log(`Found ${accommodations.length} accommodation(s).`);

    for (const acc of accommodations) {
      const images = Array.from({ length: 5 }, (_, i) =>
        `https://picsum.photos/seed/${acc._id}-${i}/800/600`
      );
      acc.images = images;
      await acc.save();
    }

    console.log(`Updated images for ${accommodations.length} accommodation(s).`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Updating images failed:', error.message);
    process.exit(1);
  }
};

updateImages();
