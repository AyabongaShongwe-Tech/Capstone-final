import { useState } from "react";
import { LOCATION_OPTIONS } from "../../utils/listingsData";
import "./SearchFilter.css";

// Location options come from the actual listing data
const LOCATIONS = LOCATION_OPTIONS;

/**
 * SearchFilter — the Airbnb-style search pill.
 * Fields: Location (select), Check-in, Check-out, Guests.
 * Calls `onSearch(filters)` when the search button is pressed.
 */
function SearchFilter({ onSearch }) {
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch?.({ location, checkIn, checkOut, guests });
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <div className="search__field">
        <label className="search__label" htmlFor="sf-location">
          Locations
        </label>
        <select
          id="sf-location"
          className="search__input search__select"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <span className="search__divider" />

      <div className="search__field">
        <label className="search__label" htmlFor="sf-checkin">
          Check in date
        </label>
        <input
          id="sf-checkin"
          className="search__input"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <span className="search__divider" />

      <div className="search__field">
        <label className="search__label" htmlFor="sf-checkout">
          Checkout date
        </label>
        <input
          id="sf-checkout"
          className="search__input"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <span className="search__divider" />

      <div className="search__field">
        <label className="search__label" htmlFor="sf-guests">
          Guests
        </label>
        <input
          id="sf-guests"
          className="search__input"
          type="number"
          min="0"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>

      <button className="search__btn" type="submit" aria-label="Search">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5.5 11.5L21 20"
          />
        </svg>
      </button>
    </form>
  );
}

export default SearchFilter;
