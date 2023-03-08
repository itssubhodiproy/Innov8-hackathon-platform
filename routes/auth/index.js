const router = require("express").Router();
const { loginUser, registerUser, logOut } = require("../../controller/auth");
const { JWT_AUTH } = require("../../controller/config/jwtAuth");

// login (public route)
router.post("/login", loginUser);

// registration (public route)
router.post("/register", registerUser);

// logout (private route)
router.post("/logout", JWT_AUTH, logOut);

module.exports = router;
