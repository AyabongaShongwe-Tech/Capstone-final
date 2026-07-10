import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Location from "../pages/Location/Location";
import ListingDetails from "../pages/ListingDetails/ListingDetails";
import Login from "../pages/Login/Login";
import MyReservations from "../pages/Reservations/MyReservations";
import AdminLayout from "../layouts/AdminLayout";
import ViewListings from "../pages/admin/ViewListings/ViewListings";
import CreateListing from "../pages/admin/CreateListing/CreateListing";
import EditListing from "../pages/admin/EditListing/EditListing";
import Reservations from "../pages/admin/Reservations/Reservations";
import ProtectedRoute from "./ProtectedRoute";

/** Central route table for the app. */
function AppRoutes() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<Home />} />
      <Route path="/locations/:location" element={<Location />} />
      <Route path="/listing/:id" element={<ListingDetails />} />
      <Route path="/login" element={<Login />} />

      {/* Any logged-in user (host or client) can see their reservations */}
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <MyReservations />
          </ProtectedRoute>
        }
      />

      {/* Host-only admin dashboard (protected + role-gated) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireHost>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="listings" replace />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="listings" element={<ViewListings />} />
        <Route path="listings/create" element={<CreateListing />} />
        <Route path="listings/:id/edit" element={<EditListing />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
