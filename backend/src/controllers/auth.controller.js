const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};


async function registerUser(req, res) {
  const { fullName, email, password } = req.body;

  const exists = await userModel.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("user_token", token, COOKIE_OPTIONS);

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
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("user_token", token, COOKIE_OPTIONS);

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

function logoutUser(req, res) {
  res.clearCookie("user_token", COOKIE_OPTIONS);
  res.status(200).json({ message: "User logged out successfully" });
}

async function registerFoodPartner(req, res) {
  const { name, email, phone, password, address, contactName } = req.body;

  const exists = await foodPartnerModel.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Food partner already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModel.create({
    name,
    email,
    phone,
    password: hashedPassword,
    address,
    contactName
  });

  const token = jwt.sign(
    { id: foodPartner._id, role: "foodPartner" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("partner_token", token, COOKIE_OPTIONS);

  res.status(201).json({
    message: "Food partner registered successfully",
    foodPartner: {
      _id: foodPartner._id,
      name: foodPartner.name,
      email: foodPartner.email,
      phone: foodPartner.phone,
      address: foodPartner.address,
      contactName: foodPartner.contactName

    },
  });
}

async function loginFoodPartner(req, res) {
  const { email, password } = req.body;

  const partner = await foodPartnerModel.findOne({ email }).select("+password");

  if (!partner) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValid = await bcrypt.compare(password, partner.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: partner._id, role: "foodPartner" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("partner_token", token, COOKIE_OPTIONS);

  res.status(200).json({
    message: "Food partner logged in successfully",
    foodPartner: {
      _id: partner._id,
      name: partner.name,
      email: partner.email,
    },
  });
}

function logoutFoodPartner(req, res) {
  res.clearCookie("partner_token", COOKIE_OPTIONS);
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
