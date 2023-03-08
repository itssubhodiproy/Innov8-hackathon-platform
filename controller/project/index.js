const Project = require("../../database/model/project");
const Role = require("../../database/model/role");

// project CRUD operations

const CreateProject = async (req, res) => {
  // empty fields validation
  const { name, description, link } = req.body;
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
      link,
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

const UpdateProject = async (req, res) => {};

const DeleteProject = async (req, res) => {};
