const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary from environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads a list of images to Cloudinary and returns their hosted secure URLs.
// Each item may be a remote URL or a base64 data URI. Images that are already
// hosted on Cloudinary are kept as-is (not re-uploaded).
const uploadImages = async (images = []) => {
  if (!Array.isArray(images) || images.length === 0) return [];

  const uploads = images.map(async (image) => {
    if (typeof image !== 'string' || image.trim() === '') return null;

    // Already on Cloudinary — no need to upload again.
    if (image.includes('res.cloudinary.com')) return image;

    const result = await cloudinary.uploader.upload(image, {
      folder: 'airbnb-accommodations',
    });
    return result.secure_url;
  });

  const urls = await Promise.all(uploads);
  // Drop anything that failed / was empty.
  return urls.filter(Boolean);
};

module.exports = { cloudinary, uploadImages };
