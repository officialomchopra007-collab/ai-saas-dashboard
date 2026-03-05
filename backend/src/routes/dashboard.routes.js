const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to your AI Dashboard 🚀",
    userId: req.user.id,
  });
});

module.exports = router;