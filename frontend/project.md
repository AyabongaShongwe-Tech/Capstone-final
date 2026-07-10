# Airbnb Clone — Frontend Project Brief

> Backend is already built (Node.js + Express + MongoDB, JWT auth). This document covers ONLY the frontend that needs to be built with React.js. Build everything component-based, clean, and reusable.

---

## 1. Tech Stack

- **Frontend Framework:** React.js
- **Styling:** CSS (consistent design system across the app)
- **Auth:** JWT (token stored client-side, sent with protected requests)
- **Routing:** React Router (URLs must reflect current view/page)
- **Image upload/display:** Optional, but should be supported in Create/Update Listing forms

---
## Folder Structure
==========================

src/

assets/

components/

pages/

layouts/

hooks/

utils/

routes/

App.jsx

main.jsx

==========================

## 2. Global Rules (apply to every page/component)

1. **Component-based architecture** — break UI into small, reusable components (Header, Footer, Card, Button, Modal, Form Inputs, etc.). Do not build monolithic pages.
2. **Routing** — every page/view must have its own route and URL must update accordingly (e.g. `/`, `/login`, `/admin`, `/admin/listings/create`, `/locations/:location`, `/listing/:id`).
3. **Input validation** — every form (login, create listing, update listing) must validate inputs and show clear, user-friendly error messages.
4. **Auth-protected routes** — Admin Dashboard pages should only be accessible when a valid JWT is present; redirect to login otherwise. Maintain session (e.g. via localStorage/cookies + context).
5. **Consistent styling** — one design system/theme (colors, spacing, typography, buttons) reused everywhere, not page-specific styling.
6. **Error handling & feedback** — API errors, loading states, empty states must be handled gracefully with visible feedback to the user (toast/inline message/spinner).
7. **Code quality** — modular functions/components, meaningful names, comments where logic is non-trivial.

---

## 3. Public Website (Airbnb Frontend Clone)

### 3.1 Home Page (`/`)
Mostly static content + login + a dynamic filter.

Sections (top to bottom):
- **Top Header**
  - Logo
  - Location filter (dynamic — feeds into Location Page)
  - Profile section: if logged out → "Become a host" link + Login option; if logged in → greeting with username + dropdown (View Reservations, Logout)
- **Hero Banner**
- **"Inspiration for your next trip"** — row of location cards (image + name)
- **"Discover Airbnb Experiences"**
- **"Things to do on your trip"** — static button + background image
- **"Things to do at home"** — static button + background image
- **ShopAirbnb Section** — 2 columns: (title + button) | (gift card image)
- **"Inspiration for future getaways"** — static tabs, one tab shows a list-format layout
- **Static Footer** — 4 columns of links
- **Copyright Footer** — copyright text, social links, language selector, currency selector

### 3.2 Login Page (`/login`)
- Form fields: email, password
- Client-side validation (required fields, email format) with inline error messages
- On success → store JWT, redirect to Admin Dashboard (or previous page for a regular user, if applicable)
- On failure → show error (e.g. "Invalid email or password")

### 3.3 Location Page (`/locations/:location`)
- **Location Filter** (reuse from header or a page-level filter)
- **Heading** — total number of accommodations found + location name
- **Location Cards list** — each card: image (left) + details (right):
  - Type of accommodation
  - Name
  - Amenities
  - Average star rating
  - Total reviews
  - Cost per night
- Clicking a card → navigates to Location Details Page

### 3.4 Location Details Page (`/listing/:id`)
- **Heading** — Accommodation type + location
- **Subheading** — average star rating + location
- **Image Gallery** — 1 large image (left) + 4 smaller images stacked 2x2 (right)
- **Two-column layout:**
  - **Left column (static info sections):**
    - Accommodation details
    - Where you'll sleep
    - What this place offers (amenities)
    - "7 nights in [City]" summary block
    - Reviews (overall + specific ratings: cleanliness, communication, checkIn, accuracy, location, value)
    - Host details
    - House Rules, Health & Safety, Cancellation Policy
  - **Right column — Cost Calculator (dynamic):**
    - Cost per night × total nights
    - Weekly discount
    - Cleaning fee
    - Service fee
    - Occupancy taxes and fees
    - Date pickers (check-in/check-out) + guest count selector — recalculates total live
    - **"Reserve" button** → creates a reservation via API (`POST /api/reservations`) in MongoDB
- **Footer** — Static Footer + Copyright Footer (same as Home Page)

#### Reservation object shape sent/used (reference)
```js
{
  id: 1,
  images: ["/images/new-york-lady-of-liberty.jpg", ...], // 5 images
  type: "Entire apartment",
  location: "New York",
  guests: 4,
  bedrooms: 2,
  bathrooms: 2,
  amenities: ["wifi", "kitchen", "free parking"],
  rating: 4.5,
  reviews: 320,
  price: 320,
  title: "Modern Apartment in New York",
  host: "Johann",
  host_id: "6676f16fdace0e26aed41e79",
  weeklyDiscount: 0,
  cleaningFee: 50,
  serviceFee: 50,
  occupancyTaxes: 30,
  enhancedCleaning: true,
  selfCheckIn: true,
  description: "Stay in the heart of New York City...",
  specificRatings: {
    cleanliness: 4.8,
    communication: 4.7,
    checkIn: 4.9,
    accuracy: 4.6,
    location: 4.9,
    value: 4.5
  }
}
```

---

## 4. Admin Dashboard

### 4.1 Top Header (shared across admin pages)
- Airbnb logo
- Navigation links
- **Logged in:** greeting with username + dropdown → "View Reservations", "Logout"
- **Logged out:** "Become a host" link

### 4.2 Login Page (`/admin/login`)
- Fields: email, password
- Validation + error messages
- On success → redirect to Admin Dashboard, store JWT

### 4.3 View Listings Page (`/admin/listings`) — Dashboard home
- List/grid of all property listings showing:
  - Title, Location, Price, Main image
- Each listing has **Update** and **Delete** actions

### 4.4 Create Listing Page (`/admin/listings/create`)
Form fields (all required, all validated with clear error messages):
- Title
- Location
- Description
- Bedrooms
- Bathrooms
- Guests
- Type (e.g. Entire apartment, Private room, etc.)
- Price (per night)
- Amenities (multi-select/checkbox list)
- Images (upload — optional per brief, but include UI for it)
- Weekly discount
- Cleaning fee
- Service fee
- Occupancy taxes

### 4.5 Update Listing Page (`/admin/listings/:id/edit`)
- Same form/fields as Create Listing
- Pre-filled with existing listing data
- Save updates and reflect changes immediately in View Listings

### 4.6 Reservations View (from header dropdown)
- Table/list of reservations (by host and/or by user depending on role)

---

## 5. Auth & User Data Reference

```js
// Example user records
{ username: 'John Doe', password: 'password123', role: 'user' }
{ username: 'Jane Doe', password: 'password321', role: 'host' }
```

- JWT-based auth: login → receive token → store it → attach to protected requests (`Authorization: Bearer <token>`)
- Only authenticated users can access Admin Dashboard routes
- Logout clears token/session and redirects to login/home

---

## 6. Backend API Endpoints Already Available (for reference — do not rebuild)

```
POST   /api/users/login
POST   /api/accommodations
GET    /api/accommodations
DELETE /api/accommodations/:id
POST   /api/reservations
GET    /api/reservations/host
GET    /api/reservations/user
DELETE /api/reservations/:id
```
> Note: brief lists Create/Read/Delete explicitly for accommodations — confirm with your backend code whether an Update (`PUT/PATCH`) endpoint exists for the Update Listing page to call.

---

## 7. Suggested Component Breakdown

- `Header/` — TopHeader, ProfileDropdown, LocationFilter
- `Footer/` — StaticFooter, CopyrightFooter
- `Home/` — HeroBanner, LocationCardRow, ExperienceSection, ShopAirbnbSection, TabsSection
- `Locations/` — LocationHeading, LocationCard, LocationCardList
- `ListingDetails/` — ImageGallery, ListingInfoSections, ReviewsSection, HostDetails, CostCalculator, DatePicker, GuestCounter, ReserveButton
- `Auth/` — LoginForm, ProtectedRoute
- `Admin/` — AdminHeader, ListingTable/Grid, ListingForm (shared by Create & Update), ReservationsTable
- `Common/` — Button, Input, Select, ErrorMessage, Loader, Modal

---

## 8. Definition of Done (per rubric expectations)

- All pages functional, routed, and styled consistently
- Forms validate input and show errors
- JWT auth fully working with protected admin routes
- CRUD flows (Create/View/Update/Delete listings) work end-to-end against the existing backend
- Reservation flow (cost calculation + booking) works end-to-end
- Clean, modular, commented code
- Every secure things like backend url jwt secred use .env file 
- USe this Base URL for API request to backend take it from .env file 



## Demo accounts

- Host: Jane Doe / password321

- User: John Doe / password123