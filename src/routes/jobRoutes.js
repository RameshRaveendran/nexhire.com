const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getJobs } = require("../controllers/jobController");

router.get("/", protect, getJobs);

module.exports = router;