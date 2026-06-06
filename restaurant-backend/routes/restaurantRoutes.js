const express = require("express");
const router = express.Router();

const {
  getRestaurant,
  updateRestaurant,
} = require("../controllers/restaurantController");

router.get("/", getRestaurant);
router.put("/", updateRestaurant);

module.exports = router;