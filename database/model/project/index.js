const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    enum: ["submitted", "stage1", "stage2", "qualified", "rejected"],
    default: "submitted",
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);
