const express = require("express");
const router = express.Router();

const {
  landingPage,
  homePage,
  searchJobs,
  dashboardPage
} = require("../controllers/pageController");

const protectPage = require("../middleware/authPageMiddleware");

// Optional auth middleware for search history tracking
const optionalAuth = (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const token = req.cookies.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token invalid or expired, continue without auth
    }
  }
  next();
};

router.get("/", landingPage);

router.get("/home", homePage);

router.get("/search", optionalAuth, searchJobs);

router.get("/dashboard", protectPage, dashboardPage);

module.exports = router;