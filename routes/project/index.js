const router = require("express").Router();
const {
  CreateProject,
  UpdateProject,
  DeleteProject,
  GetAllProjects,
  GetProjectById,
} = require("../../controller/project");
const { JWT_AUTH } = require("../../controller/config/jwtAuth");

// create project (private route)
router.post("/create-project", JWT_AUTH, CreateProject);

router.put("/update-project", JWT_AUTH, UpdateProject);

router.delete("/delete-project", JWT_AUTH, DeleteProject);

router.get("/get-all-projects", JWT_AUTH, GetAllProjects);

router.get("/get-project", JWT_AUTH, GetProjectById);

module.exports = router;
