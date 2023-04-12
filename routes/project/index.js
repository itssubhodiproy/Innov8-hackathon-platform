const router = require("express").Router();
const {
  CreateProject,
  UpdateProject,
  DeleteProject,
  GetAllProjects,
  GetProjectById,
  changeProjectStatus,
} = require("../../controller/project");
const { JWT_AUTH } = require("../../controller/config/jwtAuth");

// create project (private route)
router.post("/create-project", JWT_AUTH, CreateProject);

// update project (private route)
router.put("/update-project", JWT_AUTH, UpdateProject);

// delete project (private route)
router.delete("/delete-project", JWT_AUTH, DeleteProject);

// get all projects of current loggedIn user (private route)
router.get("/get-all-projects", JWT_AUTH, GetAllProjects);

// get a single project by ID (private route)
router.get("/get-project", JWT_AUTH, GetProjectById);

// change the status of the project for only admin (private route)
router.put("/change-status", JWT_AUTH, changeProjectStatus);

module.exports = router;
