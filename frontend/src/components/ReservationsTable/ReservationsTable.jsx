import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getReservations, deleteReservation } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "./ReservationsTable.css";

// Format an ISO/date string to dd/mm/yyyy. Leaves already-formatted strings as-is.
function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? d : date.toLocaleDateString("en-GB");
}

// Map a raw reservation from the API into the columns the table renders
// (tolerates common field-name / populated-object variations).
function normalize(r) {
  return {
    id: r._id ?? r.id,
    bookedBy: r.userName ?? r.user?.username ?? r.bookedBy ?? "—",
    property:
      r.title ?? r.accommodation?.title ?? r.property ?? r.location ?? "—",
    checkIn: formatDate(r.checkIn),
    checkOut: formatDate(r.checkOut),
  };
}

/**
 * Shared reservations table used by both the host (admin) and the regular
 * user reservations pages. Picks the /host or /user endpoint based on the
 * logged-in user's role and sends their id.
 */
function ReservationsTable() {
  const { user, isHost } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReservations(
          isHost ? "host" : "user",
          user?._id
        );
        if (!cancelled) setReservations(data.map(normalize));
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
  }, [isHost, user?._id]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this reservation?")) return;
    setDeletingId(id);
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reservation deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete reservation.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="admin__state">Loading reservations…</p>;
  }

  if (error) {
    return <p className="admin__state">{error}</p>;
  }

  if (reservations.length === 0) {
    return <p className="admin__state">You have no reservations yet.</p>;
  }

  return (
    <div className="reservations__table-wrap">
      <table className="reservations__table">
        <thead>
          <tr>
            <th>Booked by</th>
            <th>Property</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th className="reservations__actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.bookedBy}</td>
              <td>{r.property}</td>
              <td>{r.checkIn}</td>
              <td>{r.checkOut}</td>
              <td className="reservations__actions-col">
                <button
                  className="btn btn--danger reservations__delete"
                  onClick={() => handleDelete(r.id)}
                  disabled={deletingId === r.id}
                >
                  {deletingId === r.id ? "Deleting…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationsTable;
