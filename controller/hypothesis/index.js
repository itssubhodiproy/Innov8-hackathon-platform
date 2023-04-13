const Role = require("../../database/model/role");
const Hypothesis = require("../../database/model/hypothesis");
const Project = require("../../database/model/project");
const MeetingForHypothesis = require("../../database/model/biv_phase/meeting_hypothesis/hypothesis");
const MeetingForMembers = require("../../database/model/biv_phase/meeting_hypothesis/member");
const VoteHypothesis = require("../../database/model/biv_phase/vote_hypothesis");
const Hypothesis = require("../../database/model/biv_phase/meeting_hypothesis/hypothesis");

const CreateHypothesis = async (req, res) => {
  const { title, description, projectId } = req.body;
  const userId = req.userId;
  try {
    // if the project is not in stage3 return error
    const project = await Project.findById(projectId);
    if (project.status !== "stage3") {
      return res.status(400).json({
        message: "You can not create hypothesis at this stage",
      });
    }
    // check if the user is the member of the project
    const role = await Role.findOne({ projectId, userId });
    // if user is neither member nor captain return error
    if (!role || (role.role !== "member" && role.role !== "captain")) {
      return res.status(400).json({
        message: "You are not allowed to create hypothesis",
      });
    }
    // create hypothesis
    const hypothesis = await Hypothesis.create({
      title,
      description,
      projectId,
      userId,
    });
    // return hypothesis
    return res
      .status(200)
      .json({ message: "Hypothesis created successfully", hypothesis });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteHypothesis = async (req, res) => {
  const { hypothesisId } = req.query;
  const userId = req.userId;
  try {
    // check if the user is the member of the project
    const hypothesis = await Hypothesis.findById(hypothesisId);
    // check if hypothesis exists
    if (!hypothesis) {
      return res.status(400).json({
        message: "Hypothesis not found",
      });
    }
    // check if the user is the member of the project
    const projectRole = await Role.findOne({
      projectId: hypothesis.projectId,
      userId,
    });
    // if user is neither member nor captain return error
    if (
      !projectRole ||
      (projectRole.role !== "member" && projectRole.role !== "captain")
    ) {
      return res.status(400).json({
        message: "You are not allowed to delete hypothesis",
      });
    }
    await MeetingForHypothesis.deleteMany({ hypothesisId });
    // delete hypothesis
    await hypothesis.remove();
    // remove all the votes of the hypothesis
    // return hypothesis
    return res.status(200).json({ message: "Hypothesis deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllHypothesis = async (req, res) => {
  const { projectId } = req.query;
  const userId = req.userId;
  try {
    // check if the user is the member of the project
    const user = await Role.findOne({ projectId, userId });
    if (!user && req.role === "user") {
      return res
        .status(400)
        .json({ message: "You are not allowed to view this project" });
    }
    // get all the hypothesis of the project
    const hypothesis = await Hypothesis.find({ projectId });
    if (!hypothesis) {
      return res.status(400).json({ message: "No hypothesis found" });
    }
    return res.status(200).json({ hypothesis });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const VoteEachHypothesis = async (req, res) => {
  try {
    // after each meeting, the every member who attended, will vote for each hypothesis
    const { hypothesisId, meetingId, vote } = req.body;
    const userId = req.userId;
    // extract project id from hypothesisId
    const hypothesis = await Hypothesis.findById(hypothesisId);
    const project = await Project.findById(hypothesis.projectId);
    // check whether the user already voted for the hypothesis
    const user = await MeetingForMembers.findOne({
      hypothesisId,
      meetingId,
    });
    // check if user has already voted or not
    if (user.isVoted) {
      return res.status(400).json({ message: "You already voted for this" });
    }
    // update the user's vote status
    const updateVoteStatus = await MeetingForMembers.findByIdAndUpdate(
      user._id,
      { isVoted: true }
    );
    // extract user's role
    const userRole = await Role.find({ userId, projectId: project.projectId });
    // if not, then allow the user to vote
    const voteByUser = await VoteHypothesis.create({
      hypothesisId,
      userId,
      meetingId,
      role: userRole.role,
      vote,
    });
    return res.status(200).json({ message: "Voted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateHypothesis,
  DeleteHypothesis,
  GetAllHypothesis,
  VoteEachHypothesis,
};
