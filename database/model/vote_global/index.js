const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteGlobalSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  vote: {
    type: Number,
    required: true,
  },
  stage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VoteGlobal", voteGlobalSchema);
