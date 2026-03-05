const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // 🔥 SaaS Fields
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },

    credits: {
      type: Number,
      default: 20, // Free users get 20 credits
    },

    totalMessages: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);