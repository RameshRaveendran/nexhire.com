const express = require("express");
const router = express.Router();
const SearchHistory = require("../models/searchHistoryModel");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
    try {
        const history = await SearchHistory.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            count: history.length,
            history
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch history" });
    }
});

module.exports = router;