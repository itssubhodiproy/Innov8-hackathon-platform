const Project = require("../../database/model/project");
const Role = require("../../database/model/role");
const User = require("../../database/model/user");

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
    // project name no need to be unique
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
      error,
    });
  }
};

const UpdateProject = async (req, res) => {
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
  // getting user role
  const user = await Role.findOne({
    userId: req.userId,
    projectId: req.query.projectId,
  });
  // only project captain can update project details
  if (user.role !== "captain") {
    return res.status(401).json({
      message: "Only Captain can update project",
    });
  }
  try {
    // update project
    const updatedProject = await Project.findByIdAndUpdate(
      req.query.projectId,
      {
        name,
        description,
      }
    );
    // send response to client
    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

const DeleteProject = async (req, res) => {
  // only project captain and admin can delete project
  const user = await Role.findOne({
    userId: req.userId,
    projectId: req.query.projectId,
  });
  // only project captain can update project details
  if (user.role !== "captain" && req.role !== "admin") {
    return res.status(401).json({
      message: "Only Admin and Captain can delete project",
    });
  }
  try {
    // delete project
    const deleteProject = await Project.findByIdAndDelete(req.query.projectId);
    const deleteRoles = await Role.deleteMany({
      projectId: req.query.projectId,
    });
    return res.status(200).json({
      message: "Project deleted successfully",
      project: deleteProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

const GetAllProjects = async (req, res) => {
  // get all projects of current logged in user
  try {
    const projects = await Role.find({ userId: req.userId }).populate(
      "projectId"
    );
    res.status(200).json({
      message: "This is all projects current user is involved in",
      projects,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

const GetProjectById = async (req, res) => {
  // get project details by id
  const projectId = req.query.projectId;
  try {
    // get project details
    const project = await Project.findById(projectId);
    const members = await Role.find({ projectId: projectId }).populate(
      "userId"
    );
    // send response of success
    res.status(200).json({
      projectDetails: project,
      allMembers: members,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

const changeProjectStatus = async (req, res) => {
  try {
    // verify if the user is admin or not (Global role)
    if (req.role !== "admin") {
      return res.status(401).json({
        message: "Only admin can change project status",
      });
    }
    // change the status of the project
    await Project.findByIdAndUpdate(req.query.projectId, {
      status: req.body.status,
    });
    // send response of success
    res.status(200).json({
      message: "Project status changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

module.exports = {
  CreateProject,
  UpdateProject,
  DeleteProject,
  GetAllProjects,
  GetProjectById,
  changeProjectStatus,
};
