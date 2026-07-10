# Airbnb Clone — Node.js Backend

A REST API for an Airbnb clone built with **Node.js, Express, MongoDB (Mongoose)** and **JWT** authentication. It handles CRUD operations for accommodation listings and reservations, plus authentication for users and hosts.

## Tech Stack

- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for auth
- `bcryptjs` for password hashing
- `cors`, `dotenv`

## Project Structure

```
airbnb-backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── accommodationController.js
│   ├── reservationController.js
│   └── userController.js
├── middleware/
│   └── auth.js               # JWT protect + role authorize
├── models/
│   ├── Accommodation.js
│   ├── Reservation.js
│   └── User.js
├── routes/
│   ├── accommodationRoutes.js
│   ├── reservationRoutes.js
│   └── userRoutes.js
├── seed.js                   # Sample data seeder
├── server.js                 # App entry point
└── .env                      # Environment variables
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and adjust values:

   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/airbnb-clone
   JWT_SECRET=your_long_random_secret
   JWT_EXPIRES_IN=7d
   ```

3. (Optional) Seed sample data:

   ```bash
   npm run seed
   ```

4. Start the server:

   ```bash
   npm run dev     # with nodemon
   # or
   npm start
   ```

## Authentication

Send the JWT returned by login/register in the `Authorization` header:

```
Authorization: Bearer <token>
```

## API Endpoints

### Users

| Method | Endpoint              | Access  | Description                     |
|--------|-----------------------|---------|---------------------------------|
| POST   | `/api/users/register` | Public  | Register a new user or host     |
| POST   | `/api/users/login`    | Public  | Login and receive a JWT         |
| GET    | `/api/users/profile`  | Private | Get current user's profile      |

**Register / Login body:**

```json
{ "username": "Jane Doe", "password": "password321", "role": "host" }
```

### Accommodations

| Method | Endpoint                  | Access        | Description                  |
|--------|---------------------------|---------------|------------------------------|
| GET    | `/api/accommodations`     | Public        | List all accommodations      |
| GET    | `/api/accommodations/:id` | Public        | Get one accommodation        |
| POST   | `/api/accommodations`     | Private (host)| Create a listing             |
| DELETE | `/api/accommodations/:id` | Private (host)| Delete own listing           |

`GET /api/accommodations` supports optional `?location=` and `?type=` filters.

### Reservations

| Method | Endpoint                  | Access  | Description                          |
|--------|---------------------------|---------|--------------------------------------|
| POST   | `/api/reservations`       | Private | Create a reservation                 |
| GET    | `/api/reservations/host`  | Private | Reservations for the host's listings |
| GET    | `/api/reservations/user`  | Private | Reservations made by the user        |
| DELETE | `/api/reservations/:id`   | Private | Delete a reservation (guest or host) |

**Create reservation body:**

```json
{
  "accommodation": "<accommodationId>",
  "checkIn": "2026-08-01",
  "checkOut": "2026-08-05",
  "guests": 2,
  "totalPrice": 1410
}
```

## Notes

- Passwords are hashed with bcrypt before storage and never returned in responses.
- Only hosts can create/delete accommodations; ownership is verified server-side.
- Reservations can be cancelled by either the booking guest or the owning host.
