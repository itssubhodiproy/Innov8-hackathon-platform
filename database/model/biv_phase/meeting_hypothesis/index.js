const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const meetingHypothesisSchema = new Schema({
  agenda: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

module.exports = mongoose.model("MeetingHypothesis", meetingHypothesisSchema);
