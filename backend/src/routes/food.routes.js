const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

// create food api
router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood,
);
// get all food api
router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);

// here authMiddleware are not work on fooditems api

router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  foodController.likeFood,
);

router.post("/save", authMiddleware.authUserMiddleware, foodController.saveFood)

module.exports = router;
