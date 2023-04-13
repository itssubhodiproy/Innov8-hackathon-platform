const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const meetingForHypothesisSchema = new Schema({
  meetingId: {
    type: Schema.Types.ObjectId,
    ref: "Meeting",
    required: true,
  },
  hypothesisId: {
    type: Schema.Types.ObjectId,
    ref: "Hyphothesis",
    required: true,
  },
});

module.exports = mongoose.model("MeetingForHypothesis", meetingForHypothesisSchema);
