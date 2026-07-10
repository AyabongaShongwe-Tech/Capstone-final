/**
 * Minimal cookie helpers (no extra dependency).
 *
 * Used to persist the client-readable session (user profile + token) so the
 * app knows who is logged in across refreshes. The backend additionally sets
 * its own httpOnly auth cookie on login for authenticating API requests.
 */

/** Write a cookie. Defaults to a 7-day lifetime (matches the JWT expiry). */
export function setCookie(name, value, days = 7) {
  const maxAge = days * 24 * 60 * 60; // seconds
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/** Read a cookie value, or null if it isn't set. */
export function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/** Delete a cookie by expiring it immediately. */
export function removeCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}
