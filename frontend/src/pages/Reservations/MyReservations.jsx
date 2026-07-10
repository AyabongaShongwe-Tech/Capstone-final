import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ReservationsTable from "../../components/ReservationsTable/ReservationsTable";
import "./MyReservations.css";

/**
 * Standalone "My Reservations" page for regular (non-host) users.
 * Reuses the same table component as the host dashboard.
 */
function MyReservations() {
  return (
    <div className="my-reservations">
      <Header variant="light" />

      <main className="my-reservations__body container">
        <h1 className="my-reservations__title">My Reservations</h1>
        <ReservationsTable />
      </main>

      <Footer />
    </div>
  );
}

export default MyReservations;
