/**
 * Dummy API layer.
 *
 * These functions fake the network round-trip (latency + validation) so the UI
 * flows can be built and tested end-to-end before the real backend is wired in.
 * Swap the bodies for real `axios` calls to BASE_URL when the API is ready.
 *
 * Real base URL is read from the environment (Vite exposes VITE_-prefixed vars):
 *   import.meta.env.VITE_BASE_URL
 */
import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

/**
 * Shared axios instance for real backend calls.
 * `withCredentials: true` sends/receives the auth cookie the backend sets on
 * login (cookie-based auth), so protected requests are authenticated
 * automatically. Reuse this instance for the listing/reservation calls too.
 */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ---------------------------------------------------------------------------
// Auth  (POST /api/users/login)
// ---------------------------------------------------------------------------

/**
 * Log in against the real backend.
 *
 * Endpoint: `${BASE_URL}/api/users/login`
 * Response shape: { _id, username, role, token }
 *
 * The backend also sets the auth cookie (withCredentials). We normalize the
 * flat response into { token, user } for the rest of the app.
 *
 * @returns {Promise<{ token: string, user: { _id, username, role } }>}
 */
export async function loginRequest({ username, password }) {
  try {
    const { data } = await api.post("/api/users/login", { username, password });

    return {
      token: data.token,
      user: {
        _id: data._id,
        username: data.username,
        role: data.role,
      },
    };
  } catch (err) {
    // Surface a clean, user-friendly message (backend message if present).
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      (err.response?.status === 401
        ? "Invalid username or password"
        : "Login failed. Please try again.");
    throw new Error(message, { cause: err });
  }
}

// ---------------------------------------------------------------------------
// Listings  (accommodations)
// ---------------------------------------------------------------------------

/**
 * Search accommodations from the real backend.
 *
 * Endpoint: `${BASE_URL}/api/accommodations`
 * The search values (location, guests, dates) are sent as query params, so a
 * request looks like: /api/accommodations?location=Paris&guests=4
 *
 * @param {{ location?: string, guests?: number|string,
 *           checkIn?: string, checkOut?: string }} search
 * @returns {Promise<Array>} list of accommodations
 */
export async function getAccommodations(search = {}) {
  // Only send params that actually have a value (skip empty/"all").
  const params = {};
  if (search.location) params.location = search.location;
  if (search.guests) params.guests = search.guests;
  if (search.checkIn) params.checkIn = search.checkIn;
  if (search.checkOut) params.checkOut = search.checkOut;

  try {
    const { data } = await api.get("/api/accommodations", { params });
    // Backend may return the array directly or wrapped ({ data: [...] }).
    return Array.isArray(data) ? data : data?.accommodations ?? data?.data ?? [];
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Could not load stays. Please try again.";
    throw new Error(message, { cause: err });
  }
}

/**
 * Fetch a single accommodation by id from the real backend.
 *
 * Endpoint: `${BASE_URL}/api/accommodations/:id`
 *
 * @param {string} id
 * @returns {Promise<object>} the accommodation
 */
export async function getAccommodation(id) {
  try {
    const { data } = await api.get(`/api/accommodations/${id}`);
    // Backend may return the object directly or wrapped.
    return data?.accommodation ?? data?.data ?? data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      (err.response?.status === 404
        ? "Listing not found"
        : "Could not load this stay. Please try again.");
    throw new Error(message, { cause: err });
  }
}

/**
 * GET /api/accommodations — all listings (used by the admin View Listings page).
 * (Same endpoint as getAccommodations but without search params.)
 */
export async function getListings() {
  try {
    const { data } = await api.get("/api/accommodations");
    return Array.isArray(data)
      ? data
      : data?.accommodations ?? data?.data ?? [];
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Could not load listings. Please try again.";
    throw new Error(message, { cause: err });
  }
}

/**
 * POST /api/accommodations — create a listing.
 *
 * Sent as JSON. Images go in the body as `images` (array of base64 data URLs),
 * so the backend reads them via `req.body.images` and runs uploadImages().
 */
export async function createListing(payload) {
  try {
    const { data } = await api.post("/api/accommodations", payload);
    return data?.accommodation ?? data?.data ?? data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Could not create listing. Please try again.";
    throw new Error(message, { cause: err });
  }
}

/** PUT /api/accommodations/:id — update a listing. */
export async function updateListing(id, payload) {
  try {
    const { data } = await api.put(`/api/accommodations/${id}`, payload);
    return data?.accommodation ?? data?.data ?? data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Could not update listing. Please try again.";
    throw new Error(message, { cause: err });
  }
}

/** DELETE /api/accommodations/:id — delete a listing. */
export async function deleteListing(id) {
  try {
    const { data } = await api.delete(`/api/accommodations/${id}`);
    return data ?? { success: true };
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Could not delete listing. Please try again.";
    throw new Error(message, { cause: err });
  }
}

// ---------------------------------------------------------------------------
// Reservations
// ---------------------------------------------------------------------------

/**
 * Create a reservation on the real backend.
 *
 * Endpoint: `${BASE_URL}/api/reservations`
 * Auth cookie is sent automatically (withCredentials); the payload also
 * includes the logged-in user's id.
 *
 * @param {object} payload - { accommodationId, userId, checkIn, checkOut, guests, ... }
 * @returns {Promise<object>} the created reservation
 */
export async function createReservation(payload) {
  try {
    const { data } = await api.post("/api/reservations", payload);
    return data?.reservation ?? data?.data ?? data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      (err.response?.status === 401
        ? "Please log in to make a reservation."
        : "Could not create reservation. Please try again.");
    throw new Error(message, { cause: err });
  }
}

/**
 * Fetch reservations for the logged-in user or host.
 *
 * Endpoint: `${BASE_URL}/api/reservations/user`  (regular users)
 *           `${BASE_URL}/api/reservations/host`  (hosts)
 *
 * The logged-in user's id is sent as a query param. (Browsers strip the body
 * off GET requests, so it can't go in a JSON payload — a query param is the
 * equivalent way to send it; the auth cookie also identifies the user.)
 *
 * @param {"user"|"host"} role
 * @param {string} userId - logged-in user's id
 * @returns {Promise<Array>}
 */
export async function getReservations(role = "user", userId) {
  const path =
    role === "host" ? "/api/reservations/host" : "/api/reservations/user";
  try {
    const { data } = await api.get(path, { params: { userId } });
    return Array.isArray(data)
      ? data
      : data?.reservations ?? data?.data ?? [];
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Could not load reservations. Please try again.";
    throw new Error(message, { cause: err });
  }
}

/** DELETE /api/reservations/:id */
export async function deleteReservation(id) {
  try {
    const { data } = await api.delete(`/api/reservations/${id}`);
    return data ?? { success: true };
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Could not delete reservation. Please try again.";
    throw new Error(message, { cause: err });
  }
}
