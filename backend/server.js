require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const aiRoutes = require("./routes/ai.routes");

const app = express();


/* ================================
   MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());


/* ================================
   ROUTES
================================ */

app.use("/api/ai", aiRoutes);


/* ================================
   DATABASE
================================ */

mongoose.connect(process.env.MONGO_URI)
.then(()=>{

  console.log("MongoDB connected ✅");

  app.listen(5000,()=>{
    console.log("Server running on port 5000 🚀");
  });

})
.catch(err=>{
  console.log("MongoDB connection error ❌");
});