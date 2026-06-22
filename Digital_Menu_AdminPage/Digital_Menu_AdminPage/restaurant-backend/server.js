require("dotenv").config();

const express = require("express");
const cors = require("cors");
const menuRoutes = require("./routes/menuRoutes");
require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:5174",
      "https://digital-restaurant-menu-steel.vercel.app",
      "https://digitalmenuadminpage.tejosai363.workers.dev",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Restaurant Backend Running Successfully",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});