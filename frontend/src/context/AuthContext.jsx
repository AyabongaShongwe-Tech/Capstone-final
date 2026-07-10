/* eslint-disable react-refresh/only-export-components --
   Provider + useAuth hook intentionally live together in this context module. */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCookie, setCookie, removeCookie } from "../utils/cookies";

/**
 * AuthContext — single source of truth for the logged-in user + JWT.
 *
 * Cookie-based auth: the session ({ token, user }) is persisted to a cookie so
 * a refresh keeps the user logged in. The backend also sets its own auth cookie
 * on login (sent automatically via axios `withCredentials`) for protected APIs.
 */
const AuthContext = createContext(null);

const STORAGE_KEY = "airbnb_auth";

// Read any previously stored session so we start authenticated after a refresh.
function readStoredAuth() {
  try {
    const raw = getCookie(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth); // { token, user: { username, role } } | null

  // Keep the session cookie in sync with the current auth state.
  useEffect(() => {
    if (auth) setCookie(STORAGE_KEY, JSON.stringify(auth));
    else removeCookie(STORAGE_KEY);
  }, [auth]);

  const value = useMemo(() => {
    const user = auth?.user || null;
    return {
      user,
      token: auth?.token || null,
      isAuthenticated: Boolean(auth?.token),
      isHost: user?.role === "host",
      // Called after a successful login response.
      login: ({ token, user }) => setAuth({ token, user }),
      logout: () => setAuth(null),
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Convenience hook to read auth state anywhere in the tree. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}

export default AuthContext;
