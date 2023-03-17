const router = require("express").Router();
const {
  createInvitation,
  getInvitations,
  performOperationOverInvitation,
} = require("../../controller/invitation");

const { JWT_AUTH } = require("../../controller/config/jwtAuth");

// sending invites for joining project (private route)
router.post("/send-invite", JWT_AUTH, createInvitation);

// getting all invites of user for joining the projects (private route)
router.get("/get-all-invites", JWT_AUTH, getInvitations);

// accept or reject invitations for joining the projects (private route)
router.post(
  "/action-over-invitation",
  JWT_AUTH,
  performOperationOverInvitation
);

module.exports = router;
