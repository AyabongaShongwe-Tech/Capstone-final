const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to sign a JWT for a given user id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const user = await User.create({ username, password, role });

    const token = generateToken(user._id);

    // Set the JWT as an httpOnly cookie, same as login.
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate a user and return a JWT
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
       httpOnly: true,    
       secure: false,      
       sameSite: "lax",    
       maxAge: 7 * 24 * 60 * 60 * 1000,
     });

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: token
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get the currently authenticated user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  // req.user is populated by the protect middleware
  return res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getProfile };
