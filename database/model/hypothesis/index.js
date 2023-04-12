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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Role",
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
