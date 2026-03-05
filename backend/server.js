const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

/* =========================================
   MIDDLEWARE
========================================= */

app.use(cors());
app.use(express.json());

/* =========================================
   DATABASE CONNECTION
========================================= */

connectDB();

/* =========================================
   ROUTES
========================================= */

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

/* =========================================
   HEALTH CHECK (FOR RENDER)
========================================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "AI SaaS Backend Running 🚀",
  });
});

/* =========================================
   ROOT ROUTE
========================================= */

app.get("/", (req, res) => {
  res.send("AI SaaS API is live 🚀");
});

/* =========================================
   SERVER START
========================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});