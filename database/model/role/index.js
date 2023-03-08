const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member", "panellist", "reviewer", "mentor", "judge"],
    required: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
