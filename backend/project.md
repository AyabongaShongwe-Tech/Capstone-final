# Airbnb Clone — Node.js Backend Project Context

## Project Overview

The objective of this project is to create a backend system for an Airbnb clone using Node.js, Express, and MongoDB. The backend will handle CRUD operations for accommodation listings and Reservations, and users will require reading operations for authentication and validation.

## Objective

Build a backend system that:
- Handles CRUD operations for **accommodation listings**
- Handles CRUD operations for **reservations**
- Provides **reading operations for users** for authentication and validation

## Technology Stack

- **Node.js** — Runtime environment for executing JavaScript code server-side
- **Express.js** — Web framework for Node.js to build the API
- **MongoDB** — NoSQL database to store the data
- **Mongoose** — ODM library for MongoDB
- **JWT** — For authentication and authorization
- **Multer** — Middleware for handling multipart/form-data (image uploads) *(Optional)*

## Expected Project Structure

```
project-root/
├── controllers/
│   ├── accommodationController.js
│   ├── reservationController.js
│   └── userController.js
├── models/
│   ├── Accommodation.js
│   ├── Reservation.js
│   └── User.js
├── routes/
│   ├── accommodationRoutes.js
│   ├── reservationRoutes.js
│   └── userRoutes.js
├── middleware/
│   └── auth.js
└── server.js
```

## Functional Requirements

### 1. Accommodation Management
- Create accommodation listing — `POST /api/accommodations`
- Read all accommodation listings — `GET /api/accommodations`
- Delete an accommodation listing — `DELETE /api/accommodations/:id`

### 2. User Authentication
- User login — `POST /api/users/login`

### 3. Reservation Management
- Create a reservation — `POST /api/reservations`
- Get reservations by host — `GET /api/reservations/host`
- Get reservations by user — `GET /api/reservations/user`
- Delete a reservation — `DELETE /api/reservations/:id`

## Non-Functional Requirements

- Use of JWT for authentication and authorization
- Proper error handling and status codes
- Connection to MongoDB using Mongoose
- Middleware for authentication (`auth.js`)
- Modular and clean code structure

## Database Models

### User Model

Recommended data structure (from brief):

```js
{
  username: 'John Doe',
  password: 'password123',
  role: 'user',
},
{
  username: 'Jane Doe',
  password: 'password321',
  role: 'host',
}
```

### Reservation / Accommodation Model

Recommended data structure (from brief):

```js
{
  id: 1,
  images: [
    "/images/new-york-lady-of-liberty.jpg",
    "/images/new-york-lady-of-liberty.jpg",
    "/images/new-york-lady-of-liberty.jpg",
    "/images/new-york-lady-of-liberty.jpg",
    "/images/new-york-lady-of-liberty.jpg",
  ],
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
    value: 4.5,
  }
}
```
#### Admin Dashboard Instructions

### User Authentication:
- Implement user authentication using JWT.
- Ensure that user sessions are maintained and only logged-in users can access the admin dashboard.- Add functionality to the profile icon in the header to display a dropdown menu with options to view reservations and log out.

### Navigation and Routing:
- Ensure smooth navigation between different pages.
- Update the URL to reflect the current view.
### Styling:
- Apply consistent styling across the application.
### Error Handling and Feedback:
- Implement error handling throughout the application.
- Provide clear feedback to users in case of errors.
10333 Code Quality and Documentation:
- Write clean, well-organized, and commented code.
- Ensure that functions are modular and reusable.