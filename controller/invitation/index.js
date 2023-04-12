const Role = require("../../database/model/role");
const User = require("../../database/model/user");
const Project = require("../../database/model/project");
const Invitation = require("../../database/model/invitation");

const createInvitation = async (req, res) => {
  const { email, projectId, role } = req.body;
  // if empty fields, return 400
  if (!email || !role || !projectId) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  // if current loggedin user is not admin or captain, return 403
  const fromUser = await Role.findOne({ userId: req.userId, projectId });
  if (!fromUser || (req.role !== "admin" && fromUser.role !== "captain")) {
    return res
      .status(403)
      .json({ message: "User is not authrised to create an invititation" });
  }
  // check if projectId is valid or not
  const isValidProject = await Project.findById(projectId);
  if (!isValidProject) {
    return res.status(400).json({ message: "Project does not exist" });
  }
  // check if email is valid user or not
  const toUser = await User.findOne({ email });
  if (!toUser) {
    return res.status(400).json({ message: "User does not register yet" });
  }
  // if toUser is already a member of the project, return 403
  const toUserRole = await Role.findOne({ userId: toUser._id, projectId });
  if (toUserRole) {
    return res
      .status(403)
      .json({ message: "User is already a member of the project" });
  }
  // if user is not a member of the project, create invitation
  try {
    const invitation = await Invitation.create({
      projectId: projectId,
      from: req.userId,
      to: toUser._id,
      role: role,
    });
    res
      .status(201)
      .json({ message: "Invitation created successfully", invitation });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getInvitations = async (req, res) => {
  try {
    // get all invitations of the current loggedin user
    const invitations = await Invitation.find({ to: req.userId });
    res.status(200).json({ invitations });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const performOperationOverInvitation = async (req, res) => {
  try {
    // steps
    const { invitationId } = req.query;
    const { responseType } = req.body;
    // 1. find invitation by id
    const invitation = await Invitation.findById(invitationId);
    // 2. if invitation does not exist, return 404
    if (!invitation) {
      return res.status(404).json({ message: "Invitation does not exist" });
    }
    // check if project exists or not
    const project = await Project.findById(invitation.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project does not exist" });
    }
    // 3. if invitation exists, check if the current loggedin user is the toUser
    // 4. if not, return 403
    if (invitation.to !== req.userId) {
      return res.status(403).json({ message: "User is not authorised" });
    }
    // 5. if yes, create a role for the user based on the response type
    // 5.1 if response type is accept, create a role
    // 5.2 if response type is reject, do nothing
    if (responseType !== "reject" || responseType !== "accept") {
      return res.status(400).json({
        message: "responseType only varies between accept and reject",
      });
    }
    if (responseType === "accept") {
      await Role.create({
        userId: req.userId,
        projectId: invitation.projectId,
        role: invitation.role,
      });
    }
    // 6. delete the invitation
    await Invitation.findByIdAndDelete(invitationId);
    // 7. return 200
    if (responseType === "reject") {
      return res
        .status(200)
        .json({ message: "Invitation rejected successfully" });
    }
    res.status(200).json({ message: "Invitation accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createInvitation,
  getInvitations,
  performOperationOverInvitation,
};
