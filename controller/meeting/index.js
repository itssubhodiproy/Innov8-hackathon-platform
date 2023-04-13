const Meeting = require("../../database/model/biv_phase/meeting_hypothesis");
const MeetingForMembers = require("../../database/model/biv_phase/meeting_hypothesis/member");
const MeetingForHypothesis = require("../../database/model/biv_phase/meeting_hypothesis/hypothesis");
const Role = require("../../database/model/role");
const Project = require("../../database/model/project");

const CreateMeeting = async (req, res) => {
  const { agenda, startTime, endTime, projectId, allMembers, allHypothesis } =
    req.body;
  try {
    // only captain can create meeting
    const userRole = await Role.findOne({ userId: req.role, projectId });
    if (!userRole || userRole.role !== "captain") {
      return res.status(400).json({
        message: "You are not allowed to create meeting",
      });
    }
    // create meeting
    const meeting = await Meeting.create({
      agenda,
      startTime,
      endTime,
      projectId,
    });
    const memberDocuments = allMembers.map((member) => {
      return {
        roleId: member.roleId,
        meetingId: meeting._id,
      };
    });
    const hypothesisDocuments = allHypothesis.map((hypothesis) => {
      return {
        hypothesisId: hypothesis.hypothesisId,
        meetingId: meeting._id,
      };
    });
    // every memberId and hypothesisId should be valid

    // create meeting for members and meeting for hypothesis
    await MeetingForMembers.insertMany(memberDocuments);
    await MeetingForHypothesis.insertMany(hypothesisDocuments);
    // return meeting
    return res
      .status(200)
      .json({ message: "Meeting created successfully", meeting });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllMeetingsOfProject = async (req, res) => {
  const { projectId } = req.query;
  try {
    // check if this is a valid project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(400).json({
        message: "Project not found",
      });
    }
    // check if the user is the member of the project
    const user = await Role.findOne({ projectId, userId: req.userId });
    if (!user) {
      return res.status(400).json({
        message: "You are not allowed to view this project",
      });
    }
    // get all meetings of the project
    const meetings = await Meeting.find({ projectId });
    // return meetings
    return res
      .status(200)
      .json({ message: "Meetings fetched successfully", meetings });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllMeetingsOfUser = async (req, res) => {
  try {
    // check if the user is the member of the project
    const user = await Role.findOne({ userId: req.userId });
    if (!user) {
      return res.status(400).json({
        message: "You are not allowed to view this project",
      });
    }
    // get all meetings of the project
    const meetings = await MeetingForMembers.find({ roleId: user._id });
    // return meetings
    return res
      .status(200)
      .json({ message: "You have all those meetings", meetings });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateMeeting,
  GetAllMeetingsOfProject,
  GetAllMeetingsOfUser,
};
