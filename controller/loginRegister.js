const Employee = require("../database/model/employee");
const NonEmployee = require("../database/model/non-employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    // check whether he is employee or not
    let user = await Employee.findOne({ email });
    // if not employee, check if he is non-employee
    if (!user) user = await NonEmployee.findOne({ email });
    // if not non-employee, non-existed user. throw error
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not registered with this email" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    // generate jwt token and return
    const token = await jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Logged in successfully",
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// register employee in database
const registerEmployee = async (req, res) => {
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
    const findUserByEmail = await Employee.findOne({ email });
    if (findUserByEmail) {
      throw new Error("User already exists");
    }
    // create hash password
    const HashedPassword = await bcrypt.hash(password, 10);
    const employee = await Employee.create({
      name,
      email,
      password: HashedPassword,
    });
    res.status(201).json({
      employee,
      message: "Registered successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// register non-employee in database
const registerNonEmployee = async (req, res) => {
  if (req.role != "admin" && req.role != "super-admin"){
    return res.status(401).json({ message: "Unauthorized User"});
  }
  try {
    const { name, email, password, role } = req.body;
    if (
      name === "" ||
      name === undefined ||
      email === "" ||
      email === undefined ||
      password === "" ||
      password === undefined ||
      role === "" ||
      role === undefined
    ) {
      throw new Error("Please fill all the fields");
    }
    const findUserByEmail = await NonEmployee.findOne({ email });
    if (findUserByEmail) {
      throw new Error("User already exists");
    }
    // create hash password
    const HashedPassword = await bcrypt.hash(password, 10);
    const nonEmployee = await NonEmployee.create({
      name,
      email,
      password: HashedPassword,
      role,
    });
    res.status(201).json({
      nonEmployee,
      message: "Registered successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const dashboard = (req, res) => {
  const { id, role } = req;
  res.status(200).json({
    message: `Welcome To ${role} Dashboard`,
    "user-id": id
  });
};

module.exports = {
  loginUser,
  registerEmployee,
  registerNonEmployee,
  dashboard,
};