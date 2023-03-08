const Project = require("../../database/model/project");

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
  // project name should be unique
  const existedProject = await Project.findOne({ name });
  if (existedProject) {
    return res.status(400).json({
      message: `Project with name = "${name}" already exists`,
    });
  }
  // create new project
  const newProject = Project.create({
    name,
    description,
    link,
  });
};

const UpdateProject = async (req, res) => {};

const DeleteProject = async (req, res) => {};
