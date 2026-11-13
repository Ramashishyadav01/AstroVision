# 🌟 AstroVision - Astrology Reports Web Application

A full-stack astrology web application that lets users generate and manage Vedic & Western astrology reports using the [FreeAstrologyAPI](https://freeastrologyapi.com/).

## ✨ Features

- 🔐 **JWT Authentication** — Secure register, login, forgot/reset password, and protected routes
- 🪐 **3 Astrology Report Types**:
  - **Vedic Planetary Positions** (`/planets/extended`) — Planet signs, degrees, lords & retrograde status
  - **Western Birth Chart** (`/western/planets`) — Tropical zodiac planetary placements
  - **Daily Panchang** (`/complete-panchang`) — Vedic almanac with Tithi, Nakshatra, Yoga, etc.
- 📊 **Dashboard** — Report statistics, quick-generate, recent reports
- 💾 **Report Management** — Save, view, and delete reports (MongoDB)
- 📱 **Responsive UI** — Mobile, tablet & desktop with cosmic dark-purple theme

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), Tailwind CSS, React Router DOM |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| API | FreeAstrologyAPI (freeastrologyapi.com) |

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas URI)
- A free API key from [freeastrologyapi.com](https://freeastrologyapi.com/)

## 🚀 Installation & Setup

### 1. Clone / Navigate to the project
```bash
cd "DGTLmart Assisment"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Fill in your `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/astrology_app
JWT_SECRET=your_super_secret_jwt_key_change_this
ASTROLOGY_API_KEY=your_freeastrologyapi_key_here
ASTROLOGY_API_BASE_URL=https://json.freeastrologyapi.com
NODE_ENV=development
```

Start the backend:
```bash
npm run dev    # development (nodemon)
# or
npm start      # production
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**  
Backend runs at: **http://localhost:5000**

## 🔑 Getting Your Free Astrology API Key

1. Go to [https://freeastrologyapi.com/](https://freeastrologyapi.com/)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Add it to `backend/.env` as `ASTROLOGY_API_KEY`

> **Note:** The free plan includes up to 500 API requests per day.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| POST | `/api/auth/forgot-password` | Send password reset email | No |
| GET | `/api/auth/reset-password/:token/verify` | Verify reset token | No |
| POST | `/api/auth/reset-password/:token` | Reset password | No |

### Reports
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reports/generate` | Generate astrology report | Yes |
| GET | `/api/reports` | Get all user reports | Yes |
| GET | `/api/reports/:id` | Get single report | Yes |
| DELETE | `/api/reports/:id` | Delete report | Yes |

### Generate Report Request Body
```json
{
  "reportType": "planets-extended",
  "birthData": {
    "year": 1990,
    "month": 6,
    "date": 15,
    "hours": 10,
    "minutes": 30,
    "seconds": 0,
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezone": 5.5,
    "placeName": "New Delhi, India"
  }
}
```

**reportType** options:
- `planets-extended` — Vedic Planetary Positions
- `western-planets` — Western Birth Chart
- `panchang` — Daily Panchang / Almanac

## 🗂 Project Structure

```
DGTLmart Assisment/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Report.js          # Report schema
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Profile
│   │   └── reportController.js# Generate, Get, Delete reports
│   ├── routes/
│   │   ├── auth.js            # /api/auth routes
│   │   └── reports.js         # /api/reports routes
│   ├── server.js              # Express server entry
│   ├── .env.example           # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ReportCard.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── GenerateReport.jsx
│   │   │   └── ReportDetail.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🎨 UI Theme

| Element | Color |
|---------|-------|
| Background | Dark Cosmic `#0d0618` |
| Primary Purple | `#1a0533` |
| Deep Navy | `#0d1b4b` |
| Gold Accent | `#f5c518` |
| Text | White `#ffffff` |

## 📍 Finding Latitude & Longitude

For the birth details form, users need lat/long of their birth place:
- Visit [latlong.net](https://www.latlong.net/) and search for your city
- Or use Google Maps: right-click → "What's here?"

## 🔒 Security Notes

- API keys are stored in backend `.env` — never exposed to frontend
- Passwords are hashed with bcryptjs (salt rounds: 10)
- JWTs expire in 7 days
- Each user can only access their own reports

## 🐛 Troubleshooting

**MongoDB not connecting?**
```bash
# Make sure MongoDB is running locally
mongod --dbpath /data/db
```

**API key not working?**
- Verify the key at freeastrologyapi.com dashboard
- Check you haven't exceeded the 500 req/day limit

**CORS errors?**
- Backend is configured to allow `http://localhost:5173`
- Ensure both servers are running

## 📄 License

MIT License — Free to use and modify.

---

Built with ❤️ using React, Node.js, and FreeAstrologyAPI
