const express = require("express");
const router = express.Router();

const {
  homePage,
  searchJobs,
  dashboardPage
} = require("../controllers/pageController");

const protectPage = require("../middleware/authPageMiddleware");

router.get("/", homePage);

router.get("/search", searchJobs);

router.get("/dashboard", protectPage, dashboardPage);

module.exports = router;