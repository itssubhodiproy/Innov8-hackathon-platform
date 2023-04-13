const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const meetingForMemberSchema = new Schema({
  meetingId: {
    type: Schema.Types.ObjectId,
    ref: "Meeting",
    required: true,
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("MeetingForMember", meetingForMemberSchema);
