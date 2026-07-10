import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Gallery from "../../components/ListingDetails/Gallery";
import Calendar from "../../components/ListingDetails/Calendar";
import ReserveCard from "../../components/ListingDetails/ReserveCard";
import ExploreOptions from "../../components/ListingDetails/ExploreOptions";
import { getAccommodation, createReservation } from "../../utils/api";
import { enrichListing } from "../../utils/listingsData";
import { useAuth } from "../../context/AuthContext";
import "./ListingDetails.css";
import hostAvatar from "../../assets/host-avatar.png"
import WhereSleep from "../../assets/where-sleep.png"
import AvatarReview from "../../assets/avatar-review.png"
// Local YYYY-MM-DD
function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function defaultRange() {
  const start = new Date();
  start.setDate(start.getDate() + 14);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { checkIn: ymd(start), checkOut: ymd(end) };
}

function nightsBetween(a, b) {
  if (!a || !b) return 0;
  const n = Math.round((new Date(b) - new Date(a)) / 86400000);
  return n > 0 ? n : 0;
}

function formatRange(a, b) {
  if (!a || !b) return "Select dates";
  const opts = { month: "short", day: "numeric", year: "numeric" };
  return `${new Date(a).toLocaleDateString("en-US", opts)} - ${new Date(
    b
  ).toLocaleDateString("en-US", opts)}`;
}

const FEATURES = [
  { icon: "🏠", title: "Entire home", desc: "You'll have the apartment to yourself" },
  { icon: "✨", title: "Enhanced Clean", desc: "This Host committed to Airbnb's 5-step enhanced cleaning process." },
  { icon: "🚪", title: "Self check-in", desc: "Check yourself in with the keypad." },
  { icon: "📅", title: "Free cancellation before Feb 14", desc: "" },
];

const RATING_LABELS = [
  ["cleanliness", "Cleanliness"],
  ["accuracy", "Accuracy"],
  ["communication", "Communication"],
  ["location", "Location"],
  ["checkIn", "Check-in"],
  ["value", "Value"],
];

const REVIEWS = [
  { name: "Jose", date: "December 2021", text: "Host was very attentive." },
  { name: "Luke", date: "December 2021", text: "Nice place to stay!" },
  { name: "Shayna", date: "December 2021", text: "Wonderful neighborhood, easy access to restaurants and the subway, cozy studio apartment with a super comfortable bed. Great host, super helpful and responsive. Cool murphy bed…" },
  { name: "Josh", date: "November 2021", text: "Well designed and fun space, neighborhood has lots of energy and amenities." },
  { name: "Vladko", date: "November 2020", text: "This is amazing place. It has everything one needs for a monthly business stay. Very clean and organized place. Amazing hospitality affordable price." },
  { name: "Jennifer", date: "January 2022", text: "A centric place, near of a sub station and a supermarket with everything you need. …" },
];

// Static "What this place offers" list (icons + labels) — matches the design.
const PLACE_OFFERS = [
  {
    label: "Garden view",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20c0-8 6-16 16-16 0 10-8 16-16 16Z" />
        <path d="M4 20 14 10" />
      </svg>
    ),
  },
  {
    label: "Kitchen",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 9 12 12" />
      </svg>
    ),
  },
  {
    label: "Wifi",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8.5c5-4.5 15-4.5 20 0" />
        <path d="M5 12c4-3.5 10-3.5 14 0" />
        <path d="M8.5 15.5c2-2 5-2 7 0" />
        <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Pets allowed",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="11" r="1.7" />
        <circle cx="10" cy="7.5" r="1.7" />
        <circle cx="14" cy="7.5" r="1.7" />
        <circle cx="18" cy="11" r="1.7" />
        <path d="M8 16.5c0-2.5 8-2.5 8 0s-8 2.5-8 0Z" />
      </svg>
    ),
  },
  {
    label: "Free washer - in building",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <circle cx="12" cy="13" r="4" />
        <path d="M8 6h.01" />
      </svg>
    ),
  },
  {
    label: "Dryer",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 2 3 3 3 0-3 0-4 0-6Z" />
      </svg>
    ),
  },
  {
    label: "Central air conditioning",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="8" rx="1.5" />
        <path d="M7 16v2M12 16v2M17 16v2" />
      </svg>
    ),
  },
  {
    label: "Security cameras on property",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="13" height="7" rx="1.5" />
        <path d="M16 9 20 7v8l-4-2" />
        <circle cx="9" cy="10.5" r="1.4" />
      </svg>
    ),
  },
  {
    label: "Refrigerator",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M6 10h12" />
        <path d="M9 6v2M9 13v3" />
      </svg>
    ),
  },
  {
    label: "Bicycles",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="16" r="3.5" />
        <circle cx="18" cy="16" r="3.5" />
        <path d="M6 16 10 9h5l-3 7" />
        <path d="M9.5 9H14" />
        <path d="M15 9 18 16" />
      </svg>
    ),
  },
];

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dates, setDates] = useState(defaultRange);
  const [guests, setGuests] = useState(2);
  const [confirmation, setConfirmation] = useState(null);
  const [reserving, setReserving] = useState(false);

  // Fetch the accommodation by id from the API whenever the id changes.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAccommodation(id);
        // Enrich so the detail sections always have the fields they render.
        if (!cancelled) setListing(enrichListing(data));
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header variant="light" />
        <div className="container" style={{ padding: "80px 0" }}>
          <p>Loading stay…</p>
        </div>
        <Footer />
      </div>
    );
  }
console.log("Listing",listing)
console.log("user",user)
  if (error || !listing) {
    return (
      <div>
        <Header variant="light" />
        <div className="container" style={{ padding: "80px 0" }}>
          <h1>{error || "Listing not found"}</h1>
          <Link to="/">← Back home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const nights = nightsBetween(dates.checkIn, dates.checkOut);

  async function handleReserve() {
    if (nights === 0) {
      setConfirmation({ error: true, text: "Please select valid dates first." });
      return;
    }

    // Reservations require a logged-in user — bounce to login and come back.
    if (!isAuthenticated) {
      toast.error("Please log in to make a reservation.");
      navigate("/login", { state: { from: routerLocation } });
      return;
    }

    // Live total = nights × price − weekly discount + fees.
    const weeklyDiscount = nights >= 7 ? listing.weeklyDiscount : 0;
    const totalPrice =
      listing.price * nights -
      weeklyDiscount +
      listing.cleaningFee +
      listing.serviceFee +
      listing.occupancyTaxes;

    // Payload for POST /api/reservations — user id comes from the auth context.
    const payload = {
      accommodation: listing.id,
      user: user._id,
      userName: user?.username,
      host:listing.host_id,
      title: listing.title,
      location: listing.location,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      nights,
      guests,
      totalPrice,
    };

    setReserving(true);
    setConfirmation(null);
    try {
      await createReservation(payload);
      toast.success("Reservation confirmed!");
      setConfirmation({
        error: false,
        text: `Reserved ${listing.title} for ${nights} night${
          nights > 1 ? "s" : ""
        }, ${guests} guest${guests > 1 ? "s" : ""}.`,
      });
    } catch (err) {
      toast.error(err.message);
      setConfirmation({ error: true, text: err.message });
    } finally {
      setReserving(false);
    }
  }

  return (
    <div className="details-page">
      <Header variant="light" />

      <div className="details container">
        {/* Title block */}
        <div className="details__titlebar">
          <div>
            <h1 className="details__title">{listing.title}</h1>
            <div className="details__meta">
              <span className="details__star">★</span> {listing.rating.toFixed(1)}
              <a href="#reviews" className="details__link">
                {listing.reviews} reviews
              </a>
              <span>· 🏅 Superhost</span>
              <a href="#" className="details__link">
                {listing.location}
              </a>
            </div>
          </div>
          <div className="details__actions">
            <button type="button">⬆ Share</button>
            <button type="button">♡ Save</button>
          </div>
        </div>

        {/* Gallery */}
        <Gallery images={listing.gallery} />

        {confirmation && (
          <div
            className={`details__confirm${confirmation.error ? " is-error" : ""}`}
          >
            {confirmation.text}
          </div>
        )}

        {/* Two columns */}
        <div className="details__columns">
          <div className="details__left">
            {/* Host summary */}
            <div className="details__host-summary">
              <div>
                <h2 className="details__h2">
                  Entire rental unit hosted by {listing.host}
                </h2>
                <p className="details__subtext">
                  {guests} guests · {listing.bedrooms} bedroom · {listing.beds} bed ·{" "}
                  {listing.baths} bath
                </p>
              </div>
              <div className="details__host-avatar" aria-hidden="true"
              style={{ backgroundImage: `url(${hostAvatar})` }}
              />
            </div>

            <hr className="details__rule" />

            {/* Feature rows */}
            <ul className="details__features">
              {FEATURES.map((f) => (
                <li key={f.title} className="details__feature">
                  <span className="details__feature-icon">{f.icon}</span>
                  <div>
                    <p className="details__feature-title">{f.title}</p>
                    {f.desc && <p className="details__subtext">{f.desc}</p>}
                  </div>
                </li>
              ))}
            </ul>

            <hr className="details__rule" />

            {/* Description */}
            <p className="details__description">{listing.description}</p>
            <button className="details__showmore">Show more ›</button>

            <hr className="details__rule" />

            {/* Where you'll sleep */}
            <h2 className="details__h2">Where you'll sleep</h2>
            <div className="details__sleep">
              <div
                className="details__sleep-img"
                style={{ backgroundImage: `url(${WhereSleep})` }}
              />
              <p className="details__feature-title">Bedroom</p>
              <p className="details__subtext">1 queen bed</p>
            </div>

            <hr className="details__rule" />

            {/* What this place offers */}
            <h2 className="details__h2">What this place offers</h2>
            <ul className="details__amenities">
              {PLACE_OFFERS.map((a) => (
                <li key={a.label} className="details__amenity">
                  <span className="details__amenity-icon" aria-hidden="true">
                    {a.icon}
                  </span>
                  {a.label}
                </li>
              ))}
            </ul>
            <button className="details__outline-btn">Show all 37 amenities</button>

            <hr className="details__rule" />

            {/* Nights + calendar */}
            <h2 className="details__h2">
              {nights || 7} nights in {listing.location}
            </h2>
            <p className="details__subtext">{formatRange(dates.checkIn, dates.checkOut)}</p>
            <Calendar value={dates} onChange={setDates} />

            <hr className="details__rule" id="reviews" />

            {/* Reviews */}
            <h2 className="details__h2">
              <span className="details__star">★</span> {listing.rating.toFixed(1)} ·{" "}
              {listing.reviews} reviews
            </h2>
            <div className="details__rating-grid">
              {RATING_LABELS.map(([key, label]) => (
                <div key={key} className="details__rating-row">
                  <span className="details__rating-label">{label}</span>
                  <span className="details__rating-bar">
                    <span
                      className="details__rating-fill"
                      style={{ width: `${(listing.specificRatings[key] / 5) * 100}%` }}
                    />
                  </span>
                  <span className="details__rating-value">
                    {listing.specificRatings[key].toFixed(1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="details__reviews">
              {REVIEWS.map((r) => (
                <div key={r.name} className="details__review">
                  <div className="details__review-head">
                    <span className="details__review-avatar" aria-hidden="true"
                    style={{ backgroundImage: `url(${AvatarReview})` }}
                    />
                    <div>
                      <p className="details__feature-title">{r.name}</p>
                      <p className="details__subtext">{r.date}</p>
                    </div>
                  </div>
                  <p className="details__review-text">{r.text}</p>
                </div>
              ))}
            </div>
            <button className="details__outline-btn">Show all 12 reviews</button>

            <hr className="details__rule" />

            {/* Host */}
            <div className="details__host">
              <div className="details__host-head">
                <div className="details__host-avatar" aria-hidden="true"
                style={{ backgroundImage: `url(${hostAvatar})` }}
                />
                <div>
                  <h2 className="details__h2">Hosted by {listing.host}</h2>
                  <p className="details__subtext">Joined {listing.hostJoined}</p>
                </div>
              </div>
              <p className="details__subtext">
                ★ 12 Reviews · ✔ Identity verified · 🏅 Superhost
              </p>
              <p className="details__host-p">
                <strong>{listing.host} is a Superhost</strong>
                <br />
                Superhosts are experienced, highly rated hosts who are committed to
                providing great stays for guests.
              </p>
              <p className="details__subtext">Response rate: 100%</p>
              <p className="details__subtext">Response time: within an hour</p>
              <button className="details__outline-btn">Contact Host</button>
            </div>

            <hr className="details__rule" />

            {/* Things to know */}
            <h2 className="details__h2">Things to know</h2>
            <div className="details__know">
              <div>
                <h3 className="details__know-title">House rules</h3>
                <p className="details__subtext">Check-in: After 4:00 PM</p>
                <p className="details__subtext">Checkout: 10:00 AM</p>
                <p className="details__subtext">Self check-in with lockbox</p>
                <p className="details__subtext">Not suitable for infants (under 2 years)</p>
                <p className="details__subtext">No smoking</p>
                <p className="details__subtext">No pets</p>
                <p className="details__subtext">No parties or events</p>
              </div>
              <div>
                <h3 className="details__know-title">Health & safety</h3>
                <p className="details__subtext">Committed to Airbnb's enhanced cleaning process.</p>
                <p className="details__subtext">Airbnb's social-distancing and other COVID-19-related guidelines apply</p>
                <p className="details__subtext">Carbon monoxide alarm</p>
                <p className="details__subtext">Smoke alarm</p>
                <p className="details__subtext">Security Deposit - if you damage the home, you may be charged up to $566</p>
              </div>
              <div>
                <h3 className="details__know-title">Cancellation policy</h3>
                <p className="details__subtext">Free cancellation before Feb 14</p>
                <button className="details__showmore">Show more ›</button>
              </div>
            </div>
          </div>

          {/* Right column: reserve card */}
          <div className="details__right">
            <ReserveCard
              listing={listing}
              dates={dates}
              guests={guests}
              onDatesChange={setDates}
              onGuestsChange={setGuests}
              onReserve={handleReserve}
              reserving={reserving}
            />
          </div>
        </div>
      </div>

      {/* Explore other options + breadcrumb */}
      <ExploreOptions location={listing.location} />

      <Footer />
    </div>
  );
}

export default ListingDetails;
