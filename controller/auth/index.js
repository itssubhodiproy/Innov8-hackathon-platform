const User = require("../../database/model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register employee in database
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (
      name === "" ||
      name === undefined ||
      email === "" ||
      email === undefined ||
      password === "" ||
      password === undefined
    ) {
      throw new Error("Please fill all the fields");
    }
    // check if user already exists
    const findUserByEmail = await User.findOne({ email });
    if (findUserByEmail) {
      throw new Error("User already exists");
    }
    // create hash password
    const HashedPassword = await bcrypt.hash(password, 10);
    const registeredUser = await User.create({
      name,
      email,
      password: HashedPassword,
    });
    res.status(201).json({
      registeredUser,
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// check if user exists in database, then sends back jwt token
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === "" ||
      email === undefined ||
      password === "" ||
      password === undefined
    ) {
      throw new Error("Please fill all the fields");
    }
    let user = await User.findOne({ email });
    // if not found, return not registered
    if (!user) {
      return res
        .status(400)
        .json({ message: "User is not registered with this email" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    // generate jwt token and return
    const token = await jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "User Logged in successfully",
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const logOut = async (req, res) => {
  // remove token from auth header
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    req.status(200).json({
      message: "User Logged out successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logOut,
};
