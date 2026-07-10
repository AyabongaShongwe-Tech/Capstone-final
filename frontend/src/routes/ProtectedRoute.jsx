import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route guard.
 *
 * - Not logged in  → redirect to /login (remembering where they were headed).
 * - `requireHost` and logged in as a regular user → redirect home
 *   (admin dashboard is host-only).
 *
 * @param {boolean} requireHost - restrict to users with the "host" role
 * @param {React.ReactNode} children
 */
function ProtectedRoute({ requireHost = false, children }) {
  const { isAuthenticated, isHost } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireHost && !isHost) {
    // Logged in, but not a host: the admin area isn't for them.
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
