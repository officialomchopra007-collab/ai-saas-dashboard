const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/usage", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "plan credits totalMessages"
    );

    res.json({
      success: true,
      usage: user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch usage ❌",
    });
  }
});

module.exports = router;