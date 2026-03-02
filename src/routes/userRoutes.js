const express = require("express");
const router = express.Router();
const { registerUser , loginUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/admin-only",
    protect,
    authorize("admin"),
    (req, res) => {
        res.json({ message: "Admin access granted" });
    }
);

router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Access granted",
        user: req.user
    });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;