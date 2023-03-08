const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: [
      "admin",
      "member",
      "panellist",
      "reviewer",
      "mentor",
      "judge",
      "captain",
    ],
    default: "captain",
    required: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
