const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");

function getToken(req) {
  // 1️⃣ Prefer Authorization header (MAIN)
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ Fallback to cookies (OPTIONAL)
  return req.cookies?.user_token || req.cookies?.partner_token || null;
}

async function authFoodPartnerMiddleware(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "foodPartner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const foodPartner = await foodPartnerModel.findById(decoded.id);
    if (!foodPartner) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.foodPartner = foodPartner;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function authUserMiddleware(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware,
  getToken,
};
