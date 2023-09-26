const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if the required fields are added or not
    if (!name || !email || !mobile || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create a new user
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate and return the JWT token after sign up
    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: 600,
    });
    res.status(201).json({
      message: "User registered successfully",
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the required fields are provided
    if (!email|| !password) {
      return res
        .status(400)
        .json({ err:"Please provide email and password" });
    }

    // Find the user by email
    const user = await User.findOne({ email});
    if (!user) {
      return res.status(401).json({ err:"Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ err:"Invalid email or password" });
    }

    // Generate and return the JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: 600,
    });
    res
      .status(200)
      .json({ message: "Login successful", email: user.email, token });
  } catch (error) {
    res.status(500).json({ err: "Failed to login" });
  }
};