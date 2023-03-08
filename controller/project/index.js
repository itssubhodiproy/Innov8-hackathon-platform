const Project = require("../../database/model/project");
const Role = require("../../database/model/role");

// project CRUD operations

const CreateProject = async (req, res) => {
  // empty fields validation
  const { name, description } = req.body;
  if (
    name == "" ||
    name == undefined ||
    description == "" ||
    description == undefined
  ) {
    throw new Error("Please fill all the fields");
  }
  try {
    // project name should be unique
    const existedProject = await Project.findOne({ name });
    if (existedProject) {
      return res.status(400).json({
        message: `Project with name = "${name}" already exists`,
      });
    }
    // create new project
    const newProject = await Project.create({
      name,
      description,
    });
    // create default role as captain
    const captainRole = await Role.create({
      userId: req.userId,
      projectId: newProject._id,
    });
    // send response
    return res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const UpdateProject = async (req, res) => {
  // only project captain and admin can update project
  const user = await Role.findOne({
    userId: req.userId,
    projectId: req.query.projectId,
  });
  if (user.role !== "captain" && user.role !== "admin") {
    return res.status(401).json({
      message: "Only Admin and Captain can update project",
    });
  }
  // empty fields validation
  const { name, description } = req.body;
  if (
    name == "" ||
    name == undefined ||
    description == "" ||
    description == undefined
  ) {
    throw new Error("Please fill all the fields");
  }
  try {
    // project name should be unique
    // previous name and current name can be same
    // find the project by id and check if the name is same as the previous name
    const prevProject = await Project.findById(req.query.projectId);
    if (prevProject.name !== name) {
      // if the name is not same as the previous name then check if the name is unique amoung all the projects
      const existedProject = await Project.findOne({ name });
      if (existedProject) {
        return res.status(400).json({
          message: `Project with name = "${name}" already exists`,
        });
      }
    }
    // update project
    const updatedProject = await Project.findByIdAndUpdate(
      req.query.projectId,
      {
        name,
        description,
      }
    );
    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const DeleteProject = async (req, res) => {
  // only project captain and admin can delete project
  const user = await Role.findOne({
    userId: req.userId,
    projectId: req.query.projectId,
  });
  if (user.role !== "captain" && user.role !== "admin") {
    return res.status(401).json({
      message: "Only Admin and Captain can delete project",
    });
  }
  try {
    // delete project
    const deleteProject = await Project.findByIdAndDelete(req.query.projectId);
    return res.status(200).json({
      message: "Project deleted successfully",
      project: deleteProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports = {
  CreateProject,
  UpdateProject,
  DeleteProject,
};
