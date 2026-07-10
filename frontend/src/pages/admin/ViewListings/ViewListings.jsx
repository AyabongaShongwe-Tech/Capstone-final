import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getListings, deleteListing } from "../../../utils/api";
import "./ViewListings.css";

// Map a raw accommodation from the API into what the row renders (handles the
// backend's field-name variations: _id, images[], bedrooms/bathrooms).
function normalize(l) {
  return {
    ...l,
    id: l.id ?? l._id,
    image: l.image ?? (Array.isArray(l.images) ? l.images[0] : undefined),
    bedrooms: l.bedrooms ?? l.beds,
    bathrooms: l.bathrooms ?? l.baths,
    amenities: l.amenities ?? [],
    rating: l.rating ?? 0,
    reviews: l.reviews ?? 0,
  };
}

/** One listing row: image (left) + details (right) + actions. */
function ListingRow({ listing, onUpdate, onDelete, deleting }) {
  const specs = `${listing.guests ? `${listing.guests} guests` : ""}${
    listing.type ? ` · ${listing.type}` : ""
  } · ${listing.bedrooms} beds · ${listing.bathrooms} bath`;

  return (
    <article className="hotel-row">
      <div className="hotel-row__media">
        <div
          className="hotel-row__image"
          style={{ backgroundImage: `url(${listing.image})` }}
          role="img"
          aria-label={listing.title}
        />
        <button
          className="btn btn--primary btn--block"
          onClick={() => onUpdate(listing.id)}
        >
          Update
        </button>
        <button
          className="btn btn--danger btn--block"
          onClick={() => onDelete(listing.id)}
          disabled={deleting}
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      <div className="hotel-row__info">
        {listing.subtitle && (
          <p className="hotel-row__subtitle">{listing.subtitle}</p>
        )}
        <h2 className="hotel-row__title">{listing.title}</h2>

        <span className="hotel-row__rule" />

        <p className="hotel-row__specs">{specs}</p>
        <p className="hotel-row__amenities">
          {(listing.amenities || []).join(" · ")}
        </p>

        <span className="hotel-row__rule" />

        <div className="hotel-row__footer">
          <span className="hotel-row__rating">
            <span className="hotel-row__star" aria-hidden="true">
              ★
            </span>
            {Number(listing.rating).toFixed(1)}{" "}
            <span className="hotel-row__reviews">
              ({listing.reviews} reviews)
            </span>
          </span>

          {listing.price != null && (
            <span className="hotel-row__price">
              <strong>${listing.price}</strong> <span>/night</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function ViewListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getListings();
        setListings(data.map(normalize));
      } catch (err) {
        toast.error(err.message || "Could not load listings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast.success("Listing deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete listing.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h1 className="admin__page-title">My Hotel List</h1>

      {loading ? (
        <p className="admin__state">Loading listings…</p>
      ) : listings.length === 0 ? (
        <div className="admin__state">
          <p>You have no listings yet.</p>
          <button
            className="btn btn--primary"
            onClick={() => navigate("/admin/listings/create")}
          >
            Create your first listing
          </button>
        </div>
      ) : (
        <div className="hotel-list">
          {listings.map((listing) => (
            <ListingRow
              key={listing.id}
              listing={listing}
              deleting={deletingId === listing.id}
              onUpdate={(id) => navigate(`/admin/listings/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ViewListings;
