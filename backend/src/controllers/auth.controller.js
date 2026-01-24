const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;
  const isUserAlreadyRegistered = await userModel.findOne({ email: email });

  if (isUserAlreadyRegistered) {
    return res.status(400).json({ message: "User already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

async function loginUser(req, res) {
  // To be implemented
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email: email,
  });
  if (!user) {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

async function logoutUser(req, res) {
  // To be implemented
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}

async function registerFoodPartner(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isAccountAlreadyRegistered = await foodPartnerModel.findOne({
      email,
    });

    if (isAccountAlreadyRegistered) {
      return res
        .status(400)
        .json({ message: "Food partner already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);

    res.cookie("token", token );
    res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: {
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const foodPartner = await foodPartnerModel
      .findOne({ email })
      .select("+password");

    if (!foodPartner) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(200).json({
      message: "Food partner logged in successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        token: token
      },
    });
  } catch (error) {
    console.error("Login error:", error); // 👈 THIS will show real cause
    res.status(500).json({ message: "Internal server error" });
  }
}

function logoutFoodPartner(req, res) {
  // To be implemented
  res.clearCookie("token");
  res.status(200).json({ message: "Food partner logged out successfully" });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
