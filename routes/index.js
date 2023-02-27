const router = require("express").Router();
const auth = require("../controller/config/auth");
const {
  loginUser,
  registerEmployee,
  registerNonEmployee,
  dashboard,
} = require("../controller/loginRegister");

// login (public route)
router.post("/login", loginUser);

// register (public route only for employees)
router.post("/register-employee", registerEmployee);

// register (private route only for admin)
// admin has to be logged in to register non-employees role such as Panelist, Moderator, etc.
router.post("/register-non-employee", auth, registerNonEmployee);

// dashboard (private route for logged in user)
// every user will be redirected to their respective dashboard
router.get("/dashboard", auth, dashboard);

module.exports = router;
