import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./AdminLayout.css";

// The dashboard "filter" tabs. NavLink adds `is-active` on the matching route
// so the active tab is highlighted in the primary color.
const TABS = [
  { to: "/admin/reservations", label: "View Reservations" },
  { to: "/admin/listings", label: "View Listings", end: true },
  { to: "/admin/listings/create", label: "Create Listing" },
];

/**
 * Shared chrome for every host-only admin page: light header, a row of
 * navigation tabs, and the routed page content via <Outlet />.
 */
function AdminLayout() {
  return (
    <div className="admin">
      <Header variant="light" user="admin"/>

      <nav className="admin__tabs container" aria-label="Dashboard">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `admin__tab${isActive ? " is-active" : ""}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <main className="admin__body container">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default AdminLayout;
