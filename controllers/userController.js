const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");  
const statusCodes = require("../utils/statusCode");
const messages = require("../utils/messages");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(statusCodes.CONFLICT).json({ message: messages.USER_EXISTS });
    }

    const user = await User.create({ name, email, password });
    res.status(statusCodes.CREATED).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: messages.INTERNAL_ERROR });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists and if the entered password matches the stored hash
    if (!user || !(await bcrypt.compare(password.trim(), user.password))) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: messages.INVALID_CREDENTIALS });
    }

    res.status(statusCodes.SUCCESS).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: messages.INTERNAL_ERROR });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({ message: messages.USER_NOT_FOUND });
    }

    res.status(statusCodes.SUCCESS).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: messages.INTERNAL_ERROR });
  }
};

//FOR PROFILE MANAGEMENT 

  const getUserId = async (req, res) => {
    try {
      const { email } = req.body; 
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error("Error fetching user ID:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Update User Profile
  const updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
  
      if (!user) {
        return res.status(statusCodes.NOT_FOUND).json({ message: messages.USER_NOT_FOUND });
      }
  
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
  
      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }
  
      await user.save();
  
      res.status(statusCodes.SUCCESS).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } catch (error) {
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: messages.INTERNAL_ERROR });
    }
  };
  //change password
  const changeUserPassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
  
      const user = await User.findById(req.user.userId);
  
      if (!user) {
        return res.status(statusCodes.NOT_FOUND).json({ message: messages.USER_NOT_FOUND });
      }
  
      const oldPasswordTrimmed = oldPassword.trim();
      const newPasswordTrimmed = newPassword.trim();
  
  
      const isMatch = await bcrypt.compare(oldPasswordTrimmed, user.password);
  
      if (!isMatch) {
        return res.status(statusCodes.UNAUTHORIZED).json({ message: "Old password is incorrect" });
      }
  
      if (newPasswordTrimmed) {
        user.password = await bcrypt.hash(newPasswordTrimmed, 10);  
        await user.save();
  
        res.status(statusCodes.SUCCESS).json({
          message: "Password updated successfully",
        });
      } else {
        return res.status(statusCodes.BAD_REQUEST).json({ message: "New password is required" });
      }
  
    } catch (error) {
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: messages.INTERNAL_ERROR });
    }
  };
  

  
  module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, getUserId , changeUserPassword}
