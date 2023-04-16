const Hypothesis = require("../../database/model/hypothesis");
const Project = require("../../database/model/project");
const Role = require("../../database/model/role");
const User = require("../../database/model/user");
const VoteGlobal = require("../../database/model/project/vote_global");
const MeetingHypothesis = require("../../database/model/biv_phase/meeting_hypothesis");

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
  const projectRole = await Role.findOne({
    userId: req.userId,
    projectId: req.query.projectId,
  });
  // only project captain can update project details
  if (projectRole.role !== "captain" && projectRole.role !== "member") {
    return res.status(401).json({
      message: "Only Captain and member can update project",
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
  const projectId = req.query.projectId;
  // only project captain and admin can delete project
  const projectRole = await Role.findOne({
    userId: req.userId,
    projectId,
  });
  // only project captain can update project details
  if (projectRole.role !== "captain" && req.role !== "admin") {
    return res.status(401).json({
      message: "Only Admin and Captain can delete project",
    });
  }
  try {
    // delete project
    const deleteProject = await Project.findByIdAndDelete(projectId);
    // delete all roles of project
    await Role.deleteMany({
      projectId,
    });
    // delete all hypotheses of project
    await Hypothesis.deleteMany({ projectId });
    // delete all votes of the project
    await VoteGlobal.deleteMany({ projectId });
    // delete all meetings of the project
    await MeetingHypothesis.deleteMany({ projectId });
    // Delete Hypothesis function
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
    //if status of the project is somthing other than enums, return error
    if (
      req.body.status !== "stage1" &&
      req.body.status !== "stage2" &&
      req.body.status !== "stage3" &&
      req.body.status !== "qualified" &&
      req.body.status !== "rejected"
    ) {
      return res.status(400).json({
        message: "Invalid project status",
      });
    }
    // change the status of the project
    const project = await Project.findByIdAndUpdate(req.query.projectId, {
      status: req.body.status,
    });
    // send response of success
    res.status(200).json({
      message: "Project status changed successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
// it is only for judges who votes at every stage of project evaluation
const createGlobalVote = async (req, res) => {
  const { projectId, userId, vote } = req.body;
  try {
    // check if the user is the member of the project
    const projectRole = await Role.findOne({ projectId, userId });
    // if user is either member or captain return error
    if (
      !projectRole ||
      projectRole.role === "member" ||
      projectRole.role === "captain" ||
      req.role === "admin"
    ) {
      return res.status(400).json({
        message: "Only judges can vote",
      });
    }
    // takeout the stage from the project
    const project = await Project.findById(projectId);
    // check if the user has already voted at current stage of the project
    const isVoted = await VoteGlobal.findOne({
      projectId,
      userId,
      stage: project.stage,
    });
    if (isVoted) {
      return res.status(400).json({
        message: "You have already voted at this stage",
      });
    }
    // create vote
    const vote = await VoteGlobal.create({
      projectId,
      userId,
      role: projectRole.role,
      vote,
      stage: project.stage,
    });
    // return vote
    return res.status(200).json({ message: "Vote created successfully", vote });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateProject,
  UpdateProject,
  DeleteProject,
  GetAllProjects,
  GetProjectById,
  changeProjectStatus,
  createGlobalVote,
};
