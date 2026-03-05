const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   DATABASE
================================*/
connectDB();

/* ===============================
   ROUTES
================================*/
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

/* ===============================
   HEALTH CHECK
================================*/
app.get("/health", (req, res) => {
  res.json({ status: "AI SaaS running 🚀" });
});

/* ===============================
   SERVER
================================*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});