# 🏨 Hotel Management System API

An API built to manage **hotel rooms**, **guests**, and **bookings** efficiently.  
Developed using **Node.js**, **Express**, and **MongoDB (Mongoose)** — this API provides full CRUD functionality and clean architecture for backend data management.

---

## 🚀 Features
- Create, Read, Update, and Delete (CRUD) operations for:
  - 🛏️ Rooms  
  - 👤 Guests  
  - 📅 Bookings  
- MongoDB database connection (via Mongoose)
- Environment variables configuration using `.env`
- Optional seed script to populate sample hotel data
- Organized MVC project structure
- Clean error handling and modular route setup

---
## Base URL 

https://hotel-management-api-b4dl.onrender.com

## Post for Rooms
{
  "roomNumber": 201,
  "type": "Double",
  "price": 3500,
  "status": "available"
}

## Put for rooms
"occupied"

## Post for Guests
{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "09181234567",
  "address": "Cebu City, Philippines"
}

## Put for guests
"Taguig City, Philippines"

## Post for Bookings
{
  "guest": "6717be19ef00d32c8f6c1111",
  "room": "6717ab02ef00d32c8f6b1234",
  "checkInDate": "2025-10-23",
  "checkOutDate": "2025-10-25",
  "status": "confirmed"
}

## Put for bookings
"checked_out"

## 🧩 Project Structure

```
Hotel-Management-API/
│
├── .env
├── package.json
├── README.md
│
├── scripts/
│   └── seed.js           # Script to seed initial data
│
└── src/
    ├── app.js            # Main application entry point
    ├── config/
    │   └── db.js         # MongoDB connection logic
    ├── controllers/      # Business logic for routes
    ├── models/           # MongoDB schemas (Rooms, Guests, Bookings)
    └── routes/           # Route handlers for API endpoints
        ├── rooms.js
        ├── guests.js
        └── bookings.js
```

---

## ⚙️ Prerequisites

Before running the project, ensure the following are installed:

- **Node.js** (version ≥ 14)
- **npm** (Node Package Manager)
- A **MongoDB connection string** (from MongoDB Atlas or a local MongoDB instance)

---

## 🧾 Environment Variables

Create a `.env` file in your **project root directory** with the following variables:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/hotelDB
NODE_ENV=development
```

> ⚠️ Replace `<username>` and `<password>` with your actual MongoDB Atlas credentials.  
> Do not include quotes or spaces around the `=` signs.

✅ **Example:**
```env
MONGO_URI=mongodb+srv://admin:12345@cluster0.abcd123.mongodb.net/hotelDB
```

---

## 💻 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/hotel-management-api.git
cd hotel-management-api
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure the Environment
- Copy or create `.env` in the root folder.
- Add your MongoDB connection string and port number.

### 4️⃣ Seed Sample Data (Optional)
To populate the database with example rooms, guests, and bookings:
```bash
npm run seed
```

### 5️⃣ Start the Server
For production:
```bash
npm start
```
For development (with auto-reload via Nodemon):
```bash
npm run dev
```

---

## 🧠 Key Files

| File | Description |
|------|--------------|
| `src/app.js` | Main application entry point |
| `src/config/db.js` | MongoDB connection setup |
| `scripts/seed.js` | Script to insert sample data |
| `.env` | Environment configuration variables |

---

## 🌐 API Endpoints

**Base URL:** `/api`

### 🏠 Rooms
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/rooms` | Fetch all rooms |
| `GET` | `/api/rooms/:id` | Fetch room by ID |
| `POST` | `/api/rooms` | Add new room |
| `PUT` | `/api/rooms/:id` | Update room details |
| `DELETE` | `/api/rooms/:id` | Delete a room |

### 👤 Guests
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/guests` | Get all guests |
| `GET` | `/api/guests/:id` | Get guest by ID |
| `POST` | `/api/guests` | Add a new guest |
| `PUT` | `/api/guests/:id` | Update guest information |
| `DELETE` | `/api/guests/:id` | Remove guest record |

### 📅 Bookings
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/bookings` | Get all bookings |
| `GET` | `/api/bookings/:id` | Get booking details by ID |
| `POST` | `/api/bookings` | Create a new booking |
| `PUT` | `/api/bookings/:id` | Update booking details |
| `DELETE` | `/api/bookings/:id` | Cancel or delete a booking |

<img src="./image/GET bookings id.png" alt="GET bookings by ID">
<img src="./image/GET bookings.png" alt="GET bookings">
<img src="./image/GET guests id.png" alt="GET guests by ID">
<img src="./image/GET guests.png" alt="GET guests">
<img src="./image/GET rooms id.png" alt="GET rooms by ID">
<img src="./image/GET rooms.png" alt="GET rooms">
---

## 🧪 Example Server Output

```
[dotenv@17.2.3] injecting env (3) from .env
MongoDB Connected: cluster0.xxxxxx.mongodb.net
Server running in development mode on port 3000
```

---

## 🧰 Tech Stack

- **Backend Framework:** Node.js + Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Environment Management:** dotenv  
- **Development Tools:** Nodemon, Morgan (for logging)


---


## 🏁 Final Notes

✅ **Make sure your `.env` file is in the project root**.  
✅ **Run `npm run dev`** to start the development server.  
✅ **Test endpoints** using Postman or any REST client.


---

### 📝 Summary

This Hotel Management System API provides a modular, secure, and scalable backend for handling all hotel operations — including room management, guest profiles, and booking records — all through RESTful endpoints connected to MongoDB.

---
