import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ListingCard from "../../components/ListingCard/ListingCard";
import { getAccommodations } from "../../utils/api";
import { isAllLocation, PLACE_TYPES, AMENITIES } from "../../utils/listingsData";
import "./Location.css";

// Map a raw accommodation from the API into the shape ListingCard expects
// (handles common field-name variations so it works with the real backend).
function normalize(a) {
  return {
    ...a,
    id: a.id ?? a._id,
    beds: a.beds ?? a.bedrooms,
    baths: a.baths ?? a.bathrooms,
    amenities: a.amenities ?? [],
    rating: a.rating ?? 0,
    reviews: a.reviews ?? 0,
    image: a.image ?? (Array.isArray(a.images) ? a.images[0] : undefined),
  };
}

const PRICE_RANGES = [
  { key: "any", label: "Any price", min: 0, max: Infinity },
  { key: "low", label: "Under $150", min: 0, max: 150 },
  { key: "mid", label: "$150 – $300", min: 150, max: 300 },
  { key: "high", label: "$300+", min: 300, max: Infinity },
];

// Format the check-in / check-out params for the compact header search
function formatDates(checkIn, checkOut) {
  if (!checkIn && !checkOut) return "Any week";
  const opts = { month: "short", day: "numeric" };
  const start = checkIn ? new Date(checkIn).toLocaleDateString("en-US", opts) : "";
  const end = checkOut ? new Date(checkOut).toLocaleDateString("en-US", opts) : "";
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

function Location() {
  const { location = "Bordeaux" } = useParams();
  const [searchParams] = useSearchParams();

  // Preferences carried from the home search
  const guestPref = Number(searchParams.get("guests")) || 0;
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const locationLabel = isAllLocation(location) ? "Anywhere" : location;

  // Filter state (chips)
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [instantBook, setInstantBook] = useState(false);
  const [placeType, setPlaceType] = useState("Any");
  const [priceKey, setPriceKey] = useState("any");
  const [amenities, setAmenities] = useState([]);
  const [favorites, setFavorites] = useState(() => new Set([2])); // #2 pre-liked (matches design)
  const [openMenu, setOpenMenu] = useState(null); // "type" | "price" | "more" | null

  // Results fetched from the backend for the current search.
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch /api/accommodations whenever the location or search params change.
  // The location + guests + dates are sent as query params to the API.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAccommodations({
          location: isAllLocation(location) ? undefined : location,
          guests: guestPref || undefined,
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
        });
        if (!cancelled) setListings(data.map(normalize));
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          toast.error(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location, guestPref, checkIn, checkOut]);

  // Chip filters are applied client-side over the fetched results.
  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.key === priceKey);
    return listings.filter((l) => {
      if (freeCancellation && !l.freeCancellation) return false;
      if (instantBook && !l.instantBook) return false;
      if (placeType !== "Any" && l.type !== placeType) return false;
      if (l.price < range.min || l.price > range.max) return false;
      if (amenities.length && !amenities.every((a) => l.amenities.includes(a)))
        return false;
      return true;
    });
  }, [listings, freeCancellation, instantBook, placeType, priceKey, amenities]);

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAmenity(a) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  function toggleMenu(name) {
    setOpenMenu((cur) => (cur === name ? null : name));
  }

  const priceLabel = PRICE_RANGES.find((r) => r.key === priceKey).label;

  return (
    <div className="location-page">
      <Header
        variant="light"
        searchSummary={{
          location: locationLabel,
          dates: formatDates(checkIn, checkOut),
          guests: guestPref > 0 ? `${guestPref} guests` : "Add guests",
        }}
      />

      <div className="location__body container">
        <h1 className="location__heading">
          {filtered.length} Airbnb Luxe stays in {locationLabel}
        </h1>

        {/* ---- Filter chips ---- */}
        <div className="filters">
          <button
            className={`chip${freeCancellation ? " is-active" : ""}`}
            onClick={() => setFreeCancellation((v) => !v)}
          >
            Free cancellation
          </button>

          {/* Type of place dropdown */}
          <div className="chip-wrap">
            <button
              className={`chip${placeType !== "Any" ? " is-active" : ""}`}
              onClick={() => toggleMenu("type")}
            >
              {placeType === "Any" ? "Type of place" : placeType} ▾
            </button>
            {openMenu === "type" && (
              <div className="dropdown">
                {["Any", ...PLACE_TYPES].map((t) => (
                  <button
                    key={t}
                    className={`dropdown__item${placeType === t ? " is-selected" : ""}`}
                    onClick={() => {
                      setPlaceType(t);
                      setOpenMenu(null);
                    }}
                  >
                    {t === "Any" ? "Any type" : t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price dropdown */}
          <div className="chip-wrap">
            <button
              className={`chip${priceKey !== "any" ? " is-active" : ""}`}
              onClick={() => toggleMenu("price")}
            >
              {priceKey === "any" ? "Price" : priceLabel} ▾
            </button>
            {openMenu === "price" && (
              <div className="dropdown">
                {PRICE_RANGES.map((r) => (
                  <button
                    key={r.key}
                    className={`dropdown__item${priceKey === r.key ? " is-selected" : ""}`}
                    onClick={() => {
                      setPriceKey(r.key);
                      setOpenMenu(null);
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={`chip${instantBook ? " is-active" : ""}`}
            onClick={() => setInstantBook((v) => !v)}
          >
            Instant Book
          </button>

          {/* More filters (amenities) */}
          <div className="chip-wrap">
            <button
              className={`chip${amenities.length ? " is-active" : ""}`}
              onClick={() => toggleMenu("more")}
            >
              More filters{amenities.length ? ` (${amenities.length})` : ""} ▾
            </button>
            {openMenu === "more" && (
              <div className="dropdown dropdown--wide">
                <p className="dropdown__title">Amenities</p>
                {AMENITIES.map((a) => (
                  <label key={a} className="dropdown__check">
                    <input
                      type="checkbox"
                      checked={amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                    />
                    {a}
                  </label>
                ))}
              </div>
            )}
          </div>

          {(freeCancellation ||
            instantBook ||
            placeType !== "Any" ||
            priceKey !== "any" ||
            amenities.length > 0) && (
            <button
              className="chip chip--clear"
              onClick={() => {
                setFreeCancellation(false);
                setInstantBook(false);
                setPlaceType("Any");
                setPriceKey("any");
                setAmenities([]);
                setOpenMenu(null);
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Active preference note from the home search */}
        {guestPref > 0 && (
          <p className="location__pref-note">
            Showing stays for {guestPref} guest{guestPref > 1 ? "s" : ""}
            {checkIn || checkOut ? ` · ${formatDates(checkIn, checkOut)}` : ""}
          </p>
        )}

        {/* ---- Results ---- */}
        <div className="location__results">
          {loading ? (
            <p className="location__empty">Loading stays…</p>
          ) : error ? (
            <p className="location__empty">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="location__empty">
              No stays match your search. Try adjusting your filters or guests.
            </p>
          ) : (
            filtered.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                favorite={favorites.has(listing.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Location;
