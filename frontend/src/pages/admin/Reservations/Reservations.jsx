import ReservationsTable from "../../../components/ReservationsTable/ReservationsTable";

/** Host view: reservations for their properties, inside the admin dashboard. */
function Reservations() {
  return (
    <section>
      <h1 className="admin__page-title reservations__heading">
        My Reservations
      </h1>
      <ReservationsTable />
    </section>
  );
}

export default Reservations;
