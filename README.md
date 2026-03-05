# NexHire – Job Search Aggregator Platform 🚀

A full-stack job search platform that aggregates job listings from multiple APIs, allowing users to search, filter, and track job opportunities with a modern, secure interface.

---

## ✨ Features Implemented

### User Authentication
- User registration with complete profile details (First Name, Last Name, DOB, Gender, Mobile, Email, Password)
- Secure login with JWT token authentication
- Password encryption using bcrypt
- HTTP-only cookies for token storage
- Logout with session termination and back-button protection

### User Interface
- Modern landing page with hero section and call-to-action buttons
- User dashboard displaying profile information (Email, Mobile, Gender, DOB)
- Beautiful job search results page with glassmorphic design
- Dark theme with cyan accent colors
- Responsive mobile-friendly design

### Job Search Features
- Multi-API job aggregation (Remotive, Arbeitnow, The Muse)
- Intelligent job ranking by relevance
- Automatic deduplication of job listings
- Location-based filtering with smart fallback logic
- Real-time search results display

### Search History
- Automatic tracking of user searches
- Display last 10 searches with timestamps
- Search history visible on user dashboard
- Date and time tracking for each search

### Security Features
- JWT-based authentication with 1-day token expiration
- Cache prevention headers on protected pages
- Browser back-button protection after logout
- Server-side session verification
- Input validation with SweetAlert2 alerts

### User Experience Enhancements
- SweetAlert2 for all form validations and confirmations
- Flatpickr modern date picker for DOB selection
- Form validation before submission
- Logout confirmation dialog
- Direct links to apply for jobs
- Professional job cards with company and location info

---

## 🛠 Tech Stack

**Backend:**
- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB Atlas - Cloud database
- Mongoose - MongoDB ORM
- JWT - Token authentication
- bcrypt - Password hashing

**Frontend:**
- EJS - Template engine
- HTML5 & CSS3 - Markup and styling
- JavaScript - Interactivity
- SweetAlert2 - Alert dialogs (CDN)
- Flatpickr - Date picker (CDN)

**External APIs:**
- Remotive API - Remote job listings
- Arbeitnow API - General job board
- The Muse API - Company job listings

---

## 📋 Installation & Setup

### Prerequisites
- Node.js v14+
- MongoDB Atlas account
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ramesh-raveendran/lexhire.git
   cd nexhire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in root directory
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri_here
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

---

## 📁 Project Structure

```
src/
├── app.js                          # Express application
├── config/
│   └── db.js                       # MongoDB connection
├── controllers/
│   ├── authPageController.js       # Login, register, logout
│   ├── pageController.js           # Dashboard, search, results
│   ├── jobController.js            # Job operations
│   └── userController.js           # User management
├── middleware/
│   └── authPageMiddleware.js       # JWT verification
├── models/
│   ├── User.js                     # User schema
│   └── searchHistoryModel.js       # Search history schema
├── routes/
│   ├── authPageRoutes.js           # Auth routes
│   ├── pageRoutes.js               # Page routes
│   ├── jobRoutes.js                # Job routes
│   ├── searchHistoryRoutes.js      # History routes
│   └── userRoutes.js               # User routes
├── services/
│   └── jobService.js               # Job aggregation engine
├── public/
│   └── styles.css                  # Global styles
└── views/
    ├── index.ejs                   # Home page
    ├── landing.ejs                 # Landing page
    ├── login.ejs                   # Login page
    ├── register.ejs                # Registration page
    ├── dashboard.ejs               # User dashboard
    └── results.ejs                 # Job results page
```

---

## 🚀 How It Works

### User Registration & Login Flow
1. User lands on `/` (landing page)
2. Clicks "Get Started" → redirects to `/register`
3. Fills registration form with profile details
4. Password encrypted with bcrypt
5. On successful registration → redirects to `/login`
6. User logs in with email and password
7. JWT token created and stored in HTTP-only cookie
8. Redirects to `/dashboard`

### Dashboard & Job Search Flow
1. User views dashboard with profile info and search history
2. Enters job keyword and location
3. Submits search form
4. Server calls multiple job APIs simultaneously
5. All jobs aggregated, ranked by relevance, deduplicated
6. Results displayed on `/search` page with professional cards
7. Search automatically saved to history with timestamp
8. User can modify search parameters and search again

### Logout & Session Protection
1. User clicks logout button
2. Confirmation dialog appears via SweetAlert2
3. On confirmation, POST request to `/logout`
4. Token cookie cleared
5. Cache prevention headers set
6. Browser history manipulated to prevent back-button access
7. Redirect to landing page
8. If user tries to access dashboard via back-button → redirected to login

---

## 📊 Database Schema

### User Collection
```json
{
  "_id": "ObjectId",
  "firstName": "String",
  "lastName": "String",
  "dob": "Date",
  "gender": "String (Male/Female/Other)",
  "mobileNumber": "String",
  "email": "String (unique)",
  "password": "String (hashed)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Search History Collection
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (reference to User)",
  "keyword": "String",
  "createdAt": "Date"
}
```

---

## 🔐 Security Implementation

- **Password Security**: Bcrypt hashing with salt rounds
- **Token Authentication**: JWT with 1-day expiration
- **Session Protection**: HTTP-only cookies
- **Cache Prevention**: HTTP headers prevent browser caching of protected pages
- **Back-Button Protection**: JavaScript history manipulation
- **Input Validation**: Client-side and server-side validation
- **Protected Routes**: Middleware verifies JWT before allowing access

---

## 🎯 Key Implementation Details

### Job Aggregation Algorithm
```
1. Fetch jobs from Remotive, Arbeitnow, The Muse simultaneously
2. Score each job based on keyword relevance
3. Remove duplicate jobs (same title + company + location)
4. Filter by location (fallback to all jobs if no matches)
5. Sort by relevance score (highest first)
6. Cache results for 60 seconds
```

### Search History Display
- Last 10 searches shown on dashboard
- Each search shows keyword and exact date/time
- Automatically created when user searches
- Only visible to logged-in users

### Form Validation
- All registration fields required
- Email format validation
- DOB using modern Flatpickr date picker
- Real-time SweetAlert2 feedback on errors
- Server-side validation before database operations

---

## 📝 API Integrations

All jobs are fetched from three external APIs:

1. **Remotive** - Remote job listings
2. **Arbeitnow** - General job board
3. **The Muse** - Company job database

Results are aggregated, ranked, and deduplicated before display.

---

## 🧪 Testing the Application

### Test Scenario 1: Complete User Flow
1. Navigate to http://localhost:5000
2. Click "Get Started"
3. Fill registration form → Submit
4. Login with registered email/password
5. View dashboard with profile info
6. Search for jobs (e.g., "Developer", "New York")
7. View results page
8. Click back and verify cache prevention
9. Logout and verify back-button protection

### Test Scenario 2: Search History
1. After login, perform 3 different job searches
2. View search history on dashboard
3. Verify all searches show with correct date/time
4. Click back and perform more searches
5. Verify history updates correctly

### Test Scenario 3: Session Security
1. Login to account
2. Open browser developer tools → Application → Cookies
3. Verify "token" cookie exists and is HttpOnly
4. Try to manually delete token → page should redirect to login
5. Logout and verify back-button shows landing page

---

## 👨‍💻 Author

**Ramesh Raveendran**

---

## 📜 License

MIT License - Feel free to use this project for learning and development.

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: March 5, 2026