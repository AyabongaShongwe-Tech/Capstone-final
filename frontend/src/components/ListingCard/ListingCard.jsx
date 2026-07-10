import { Link } from "react-router-dom";
import "./ListingCard.css";

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
      <path
        d="M16 28c7-4.73 11-10 11-15a5.5 5.5 0 0 0-11-.5A5.5 5.5 0 0 0 5 13c0 5 4 10.27 11 15z"
        fill={filled ? "var(--brand)" : "rgba(0,0,0,0.25)"}
        stroke={filled ? "var(--brand)" : "#ffffff"}
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * ListingCard — one search result row.
 * @param {object} listing - the listing data
 * @param {boolean} favorite - whether it's favorited
 * @param {function} onToggleFavorite - called with listing id
 */
function ListingCard({ listing, favorite, onToggleFavorite }) {
  const {
    id,
    title,
    location,
    type,
    guests,
    beds,
    baths,
    amenities,
    rating,
    reviews,
    price,
    image,
  } = listing;

  function handleHeart(e) {
    e.preventDefault();
    onToggleFavorite?.(id);
  }

  return (
    <Link to={`/listing/${id}`} className="listing-card">
      <div
        className="listing-card__image"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className="listing-card__body">
        <button
          className="listing-card__heart"
          onClick={handleHeart}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
        >
          <HeartIcon filled={favorite} />
        </button>

        <p className="listing-card__type">
          {type === "Entire Home" ? "Entire home" : type} in {location}
        </p>
        <h3 className="listing-card__title">{title}</h3>

        <span className="listing-card__rule" />

        <p className="listing-card__specs">
          {guests} · {type} · {beds} beds · {baths} bath
        </p>
        <p className="listing-card__amenities">{amenities.join(" · ")}</p>

        <div className="listing-card__footer">
          <span className="listing-card__rating">
            <span className="listing-card__star" aria-hidden="true">
              ★
            </span>
            {rating.toFixed(1)}{" "}
            <span className="listing-card__reviews">({reviews} reviews)</span>
          </span>

          <span className="listing-card__price">
            <strong>${price}</strong> <span>/night</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;
