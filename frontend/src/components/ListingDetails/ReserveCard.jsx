import "./ReserveCard.css";

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut) - new Date(checkIn);
  const n = Math.round(ms / (1000 * 60 * 60 * 24));
  return n > 0 ? n : 0;
}

/**
 * ReserveCard — dynamic cost calculator.
 * Recalculates the total live from dates + guests.
 */
function ReserveCard({ listing, dates, guests, onDatesChange, onGuestsChange, onReserve, reserving }) {
  const { checkIn, checkOut } = dates;
  const nights = nightsBetween(checkIn, checkOut);

  const subtotal = listing.price * nights;
  const applyWeeklyDiscount = nights >= 7;
  const weeklyDiscount = applyWeeklyDiscount ? listing.weeklyDiscount : 0;
  const total =
    subtotal -
    weeklyDiscount +
    listing.cleaningFee +
    listing.serviceFee +
    listing.occupancyTaxes;

  // Always offer at least 1–6 guests, extending up to the listing's capacity
  const maxOptions = Math.max(6, listing.maxGuests || 1);
  const guestOptions = Array.from({ length: maxOptions }, (_, i) => i + 1);

  return (
    <aside className="reserve">
      <div className="reserve__head">
        <span className="reserve__price">
          <strong>${listing.price}</strong> / night
        </span>
        <span className="reserve__rating">
          <span className="reserve__star">★</span> {listing.rating.toFixed(1)} ·{" "}
          <a href="#reviews" className="reserve__reviews">
            {listing.reviews} reviews
          </a>
        </span>
      </div>

      <div className="reserve__fields">
        <div className="reserve__row">
          <label className="reserve__field">
            <span className="reserve__label">CHECK-IN</span>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => onDatesChange({ ...dates, checkIn: e.target.value })}
            />
          </label>
          <label className="reserve__field reserve__field--right">
            <span className="reserve__label">CHECKOUT</span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => onDatesChange({ ...dates, checkOut: e.target.value })}
            />
          </label>
        </div>
        <label className="reserve__field reserve__field--full">
          <span className="reserve__label">GUESTS</span>
          <select value={guests} onChange={(e) => onGuestsChange(Number(e.target.value))}>
            {guestOptions.map((g) => (
              <option key={g} value={g}>
                {g} guest{g > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="reserve__btn"
        type="button"
        onClick={onReserve}
        disabled={reserving}
      >
        {reserving ? "Reserving…" : "Reserve"}
      </button>

      <p className="reserve__note">You won't be charged yet</p>

      {nights > 0 ? (
        <div className="reserve__breakdown">
          <div className="reserve__line">
            <span>
              ${listing.price} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>${subtotal}</span>
          </div>
          {applyWeeklyDiscount && (
            <div className="reserve__line reserve__line--discount">
              <span>Weekly discount</span>
              <span>-${weeklyDiscount}</span>
            </div>
          )}
          <div className="reserve__line">
            <span>Cleaning fee</span>
            <span>${listing.cleaningFee}</span>
          </div>
          <div className="reserve__line">
            <span>Service fee</span>
            <span>${listing.serviceFee}</span>
          </div>
          <div className="reserve__line">
            <span>Occupancy taxes and fees</span>
            <span>${listing.occupancyTaxes}</span>
          </div>
          <div className="reserve__total">
            <span>Total ({guests} guest{guests > 1 ? "s" : ""})</span>
            <span>${total}</span>
          </div>
        </div>
      ) : (
        <p className="reserve__hint">
          {checkIn && checkOut
            ? "Checkout must be after check-in."
            : "Add your travel dates to see the total price."}
        </p>
      )}
    </aside>
  );
}

export default ReserveCard;
