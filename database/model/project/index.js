const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  status: {
    type: String,
    enum: ["submitted", "stage1", "stage2", "qualified", "rejected"],
    default: "submitted",
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);
