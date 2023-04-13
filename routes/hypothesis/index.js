const router = require("express").Router();
const { JWT_AUTH } = require("../../controller/config/jwtAuth");
const {
  CreateHypothesis,
  DeleteHypothesis,
  GetAllHypothesis,
} = require("../../controller/hypothesis");

router.get("/get-all-hypothesis", JWT_AUTH, GetAllHypothesis);
router.post("/create-hypothesis", JWT_AUTH, CreateHypothesis);
router.delete("/delete-hypothesis", JWT_AUTH, DeleteHypothesis);

module.exports = router;
