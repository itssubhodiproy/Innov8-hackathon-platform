const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hypothesisSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  overAllScore: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Hypothesis", hypothesisSchema);
