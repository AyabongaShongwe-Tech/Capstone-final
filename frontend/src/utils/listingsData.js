/**
 * Dummy listing data for the Location results page.
 * Attributes are varied on purpose so the filters produce visible results.
 */

export const PLACE_TYPES = [
  "Entire Home",
  "Private Room",
  "Hotel Room",
  "Shared Room",
];

export const AMENITIES = ["Wifi", "Kitchen", "Free Parking", "Pool", "AC"];

const LISTINGS = [
  {
    id: 1,
    title: "Bordeaux Getaway",
    location: "Bordeaux",
    type: "Entire Home",
    guests: "4-6 guests",
    maxGuests: 6,
    beds: 5,
    baths: 3,
    amenities: ["Wifi", "Kitchen", "Free Parking"],
    rating: 5.0,
    reviews: 318,
    price: 325,
    image: "/images/listings/bordeaux-getaway.jpg",
    freeCancellation: true,
    instantBook: true,
  },
  {
    id: 2,
    title: "Charming Waterfront Condo",
    location: "Bordeaux",
    type: "Entire Home",
    guests: "4-6 guests",
    maxGuests: 6,
    beds: 5,
    baths: 3,
    amenities: ["Wifi", "Kitchen", "Free Parking"],
    rating: 5.0,
    reviews: 318,
    price: 200,
    image: "/images/listings/waterfront-condo.jpg",
    freeCancellation: true,
    instantBook: false,
  },
  {
    id: 3,
    title: "Historic City Center Home",
    location: "Bordeaux",
    type: "Entire Home",
    guests: "4-6 guests",
    maxGuests: 6,
    beds: 5,
    baths: 3,
    amenities: ["Wifi", "Kitchen", "Free Parking"],
    rating: 5.0,
    reviews: 318,
    price: 125,
    image: "/images/listings/city-center.jpg",
    freeCancellation: false,
    instantBook: true,
  },
  {
    id: 4,
    title: "Cozy Vineyard Cottage",
    location: "Bordeaux",
    type: "Private Room",
    guests: "1-2 guests",
    maxGuests: 2,
    beds: 1,
    baths: 1,
    amenities: ["Wifi", "Kitchen"],
    rating: 4.8,
    reviews: 142,
    price: 95,
    image: "/images/listings/vineyard-cottage.jpg",
    freeCancellation: true,
    instantBook: true,
  },
  {
    id: 5,
    title: "Luxe Riverside Penthouse",
    location: "Bordeaux",
    type: "Entire Home",
    guests: "6-8 guests",
    maxGuests: 8,
    beds: 4,
    baths: 3,
    amenities: ["Wifi", "Kitchen", "Free Parking", "Pool", "AC"],
    rating: 4.9,
    reviews: 210,
    price: 480,
    image: "/images/listings/riverside-penthouse.jpg",
    freeCancellation: false,
    instantBook: false,
  },
  {
    id: 6,
    title: "Boutique Hotel Suite",
    location: "Bordeaux",
    type: "Hotel Room",
    guests: "1-2 guests",
    maxGuests: 2,
    beds: 1,
    baths: 1,
    amenities: ["Wifi", "AC"],
    rating: 4.7,
    reviews: 512,
    price: 160,
    image: "/images/listings/hotel-suite.jpg",
    freeCancellation: true,
    instantBook: true,
  },
  {
    id: 7,
    title: "Budget Room Near Old Town",
    location: "Bordeaux",
    type: "Shared Room",
    guests: "1 guest",
    maxGuests: 1,
    beds: 1,
    baths: 1,
    amenities: ["Wifi"],
    rating: 4.5,
    reviews: 88,
    price: 45,
    image: "/images/listings/budget-room.jpg",
    freeCancellation: false,
    instantBook: true,
  },
  {
    id: 8,
    title: "Modern Loft with Balcony",
    location: "Bordeaux",
    type: "Entire Home",
    guests: "2-4 guests",
    maxGuests: 4,
    beds: 2,
    baths: 2,
    amenities: ["Wifi", "Kitchen", "AC"],
    rating: 4.9,
    reviews: 267,
    price: 275,
    image: "/images/listings/modern-loft.jpg",
    freeCancellation: true,
    instantBook: false,
  },

  /* A few listings for other locations (from the header dropdown) */
  {
    id: 9,
    title: "Manhattan Skyline Apartment",
    location: "New york",
    type: "Entire Home",
    guests: "2-4 guests",
    maxGuests: 4,
    beds: 2,
    baths: 2,
    amenities: ["Wifi", "Kitchen", "AC"],
    rating: 4.8,
    reviews: 430,
    price: 350,
    image: "/images/listings/manhattan.jpg",
    freeCancellation: true,
    instantBook: true,
  },
  {
    id: 10,
    title: "Charming Montmartre Studio",
    location: "Paris",
    type: "Private Room",
    guests: "1-2 guests",
    maxGuests: 2,
    beds: 1,
    baths: 1,
    amenities: ["Wifi", "Kitchen"],
    rating: 4.9,
    reviews: 389,
    price: 180,
    image: "/images/listings/paris-studio.jpg",
    freeCancellation: false,
    instantBook: true,
  },
  {
    id: 11,
    title: "Shibuya Neon Loft",
    location: "Tokoyo",
    type: "Entire Home",
    guests: "2-3 guests",
    maxGuests: 3,
    beds: 2,
    baths: 1,
    amenities: ["Wifi", "AC"],
    rating: 4.7,
    reviews: 205,
    price: 220,
    image: "/images/listings/tokyo-loft.jpg",
    freeCancellation: true,
    instantBook: false,
  },
  {
    id: 12,
    title: "Phuket Beach Villa",
    location: "Thailand",
    type: "Entire Home",
    guests: "6-8 guests",
    maxGuests: 8,
    beds: 4,
    baths: 4,
    amenities: ["Wifi", "Kitchen", "Free Parking", "Pool"],
    rating: 5.0,
    reviews: 156,
    price: 300,
    image: "/images/listings/thailand-villa.jpg",
    freeCancellation: true,
    instantBook: true,
  },
];

/** Unique locations that actually have listings. */
export const LOCATIONS = [...new Set(LISTINGS.map((l) => l.location))];

/** Options for the home search dropdown ("All Location" + real locations). */
export const LOCATION_OPTIONS = ["All Location", ...LOCATIONS];

/** True when a location value means "show everything". */
export function isAllLocation(location) {
  if (!location) return true;
  const l = location.toLowerCase();
  return l === "all" || l === "all location" || l === "anywhere";
}

/** Get listings for a location (case-insensitive). "All" returns everything. */
export function getListingsByLocation(location) {
  if (isAllLocation(location)) return LISTINGS;
  return LISTINGS.filter(
    (l) => l.location.toLowerCase() === location.toLowerCase()
  );
}

// Full amenity list shown on the details page
const FULL_AMENITIES = [
  "Garden view",
  "Kitchen",
  "Wifi",
  "Pets allowed",
  "Free washer - in building",
  "Dryer",
  "Central air conditioning",
  "Security cameras on property",
  "Refrigerator",
  "Bicycles",
];

const DEFAULT_DESCRIPTION =
  "Come and stay in this superb duplex T2, in the heart of the historic center of Bordeaux. Spacious and bright, in a real Bordeaux building in exposed stone, you will enjoy all the charms of the city thanks to its ideal location. Close to many shops, bars and restaurants, you can access the apartment by tram A and C and bus routes 27 and 44.";

const DEFAULT_SPECIFIC_RATINGS = {
  cleanliness: 5.0,
  accuracy: 5.0,
  communication: 5.0,
  location: 4.9,
  checkIn: 5.0,
  value: 4.7,
};

/**
 * Enrich a raw listing/accommodation with every field the Listing Details page
 * needs (host, fees, ratings, gallery, etc.), filling sensible defaults for
 * anything the source didn't provide. Also tolerates the real API's field-name
 * variations (`_id`, `bedrooms`/`bathrooms`, `images`).
 *
 * @param {object|null} l - a listing from dummy data OR the accommodations API
 * @returns {object|null}
 */
export function enrichListing(l) {
  if (!l) return null;

  const beds = l.beds ?? l.bedrooms ?? 1;
  const baths = l.baths ?? l.bathrooms ?? 1;
  const price = l.price ?? 0;
  const image =
    l.image ?? (Array.isArray(l.images) ? l.images[0] : undefined);
  const gallery =
    l.gallery ||
    (Array.isArray(l.images) && l.images.length ? l.images : null) ||
    [image, image, image, image, image];

  return {
    ...l,
    id: l.id ?? l._id,
    beds,
    baths,
    price,
    image,
    rating: l.rating ?? 0,
    reviews: l.reviews ?? 0,
    host: l.host || "Ghazal",
    hostJoined: l.hostJoined || "May 2021",
    superhost: true,
    bedrooms: l.bedrooms ?? Math.max(1, beds - 1),
    description: l.description || DEFAULT_DESCRIPTION,
    // Cost calculator inputs
    weeklyDiscount: l.weeklyDiscount ?? Math.round(price * 0.1),
    cleaningFee: l.cleaningFee ?? 62,
    serviceFee: l.serviceFee ?? Math.round(price * 0.25),
    occupancyTaxes: l.occupancyTaxes ?? 29,
    // Reviews
    specificRatings: l.specificRatings || DEFAULT_SPECIFIC_RATINGS,
    fullAmenities:
      l.fullAmenities || (l.amenities?.length ? l.amenities : FULL_AMENITIES),
    gallery,
  };
}

/**
 * Get a single dummy listing enriched for the Listing Details page.
 * (The page itself now fetches from the API; this stays for reference/fallback.)
 */
export function getListingById(id) {
  const l = LISTINGS.find((x) => String(x.id) === String(id));
  return enrichListing(l);
}

export default LISTINGS;
