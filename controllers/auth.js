const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    // res.send(req.body);
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
      expiresIn: 6000,
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
    // const { email, password } = req.body;
    const { email = "", mobile ="", password } = req.body;
    console.log(email, mobile, password);
    // Check if the required fields are provided
    if((email === "" && mobile === "") || !password){
      res.send("provide all fields correctly")
    }
    User.findOne({ $or: [{ email }, { mobile }] })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Invalid email or mobile" });
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (err || !passwordMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate and return the JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: 600,
        });
        res
          .status(200)
          .json({ message: "Login successful", email: user.email, token });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to login" });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
}
  