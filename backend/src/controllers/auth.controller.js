const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
    })

    const token = jwt.sign(
        { id: user._id,},
        process.env.JWT_SECRET,
        
    )

    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user:{
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
        }
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

    const token = jwt.sign(
        { id: user._id,},
        process.env.JWT_SECRET,
        
    );

    res.cookie("token", token);

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
        }
    });
}

async function logoutUser(req, res) {
    // To be implemented
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};