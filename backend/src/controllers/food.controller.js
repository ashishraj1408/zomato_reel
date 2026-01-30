const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  console.log(req.foodPartner);
  console.log(req.body);
  console.log(req.file);

  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid(),
  );

  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id,
  });
  res.status(201).json({
    message: "food created successful",
    food: foodItem,
  });
}

async function getFoodItems(req, res) {
  try {
    const userId = req.user._id;

    const foodItems = await foodModel.find({}).populate("foodPartner", "name");

    // find all likes by this user
    const userLikes = await likeModel.find({ user: userId });
    const likedFoodIds = new Set(userLikes.map((like) => like.food.toString()));

    const userSaves = await saveModel.find({ user: userId });
    const savedFoodIds = new Set(
      userSaves.map((save) => save.food.toString())
    );

    const finalFoodItems = foodItems.map((food) => ({
      _id: food._id,
      name: food.name,
      description: food.description,
      video: food.video,
      foodPartner: food.foodPartner?._id,
      foodPartnerName: food.foodPartner?.name,
      likeCount: food.likeCount,
      isLiked: likedFoodIds.has(food._id.toString()),
      isSaved: savedFoodIds.has(food._id.toString()), // 🔥 KEY LINE
    }));

    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems: finalFoodItems,
    });
  } catch (err) {
    console.error("Get food error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    const isAlreadyLiked = await likeModel.findOne({
      user: userId,
      food: foodId,
    });

    // -------- UNLIKE --------
    if (isAlreadyLiked) {
      await likeModel.deleteOne({
        user: userId,
        food: foodId,
      });

      const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { likeCount: -1 } },
        { new: true },
      );

      return res.status(200).json({
        liked: false,
        likeCount: updatedFood.likeCount,
        message: "Food unliked successfully",
      });
    }

    // -------- LIKE --------
    await likeModel.create({
      user: userId,
      food: foodId,
    });

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
      { $inc: { likeCount: 1 } },
      { new: true },
    );

    return res.status(201).json({
      liked: true,
      likeCount: updatedFood.likeCount,
      message: "Food liked successfully",
    });
  } catch (error) {
    console.error("Like food error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    const isAlreadySaved = await saveModel.findOne({
      user: userId,
      food: foodId,
    });

    if (isAlreadySaved) {
      await saveModel.deleteOne({
        user: userId,
        food: foodId,
      });

      return res.status(200).json({
        saved: false,
        message: "Food unsaved successfully",
      });
    }

    await saveModel.create({
      user: userId,
      food: foodId,
    });

    return res.status(201).json({
      saved: true,
      message: "Food saved successfully",
    });
  } catch (err) {
    console.error("Save food error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
};
