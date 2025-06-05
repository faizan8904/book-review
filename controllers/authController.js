import jwt from "jsonwebtoken";
import UserModel from "../models/User.model.js";
import { validationResult } from "express-validator";

export const signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    const user = await UserModel.create({ username, email, password });
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: `${process.env.JWT_COOKIE_EXPIRE_HOURS}h` } 
    );

    
    res
      .cookie("token", token, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE_HOURS * 60 * 60 * 1000
        ), 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(201)
      .json({ success: true, message: "Account Created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: `${process.env.JWT_COOKIE_EXPIRE_HOURS}h` } 
    );

    
    res
      .cookie("token", token, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE_HOURS * 60 * 60 * 1000
        ), 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(201)
      .json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
