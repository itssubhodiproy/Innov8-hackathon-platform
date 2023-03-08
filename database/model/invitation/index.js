const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ["User"],
    required: true,
    index: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ["User"],
    required: true,
    index: true,
  },
  role: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Invitation", InvitationSchema);
