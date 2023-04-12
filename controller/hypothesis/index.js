const Role = require("../../database/model/role");
const Hypothesis = require("../../database/model/hypothesis");

const CreateHypothesis = async (req, res) => {
  const { title, description, projectId } = req.body;
  const userId = req.userId;
  try {
    // check if the user is the member of the project
    const role = await Role.findOne({ projectId, userId });
    // if user is neither member nor captain return error
    if (!role || (role.role !== "member" && role.role !== "captain")) {
      return res.status(400).json({
        message: "You are not allowed to create hypothesis",
      });
    }
    // create hypothesis
    const hypothesis = await Hypothesis.create({
      title,
      description,
      projectId,
      userId,
      role: role.role,
    });
    // return hypothesis
    return res
      .status(200)
      .json({ message: "Hypothesis created successfully", hypothesis });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteHypothesis = async (req, res) => {
  const { hypothesisId } = req.query;
  const userId = req.userId;
  try {
    // check if the user is the member of the project
    const hypothesis = await Hypothesis.findById(hypothesisId);
    // check if hypothesis exists
    if (!hypothesis) {
      return res.status(400).json({
        message: "Hypothesis not found",
      });
    }
    // check if the user is the member of the project
    const role = await Role.findOne({
      projectId: hypothesis.projectId,
      userId,
    });
    // if user is neither member nor captain return error
    if (!role || (role.role !== "member" && role.role !== "captain")) {
      return res.status(400).json({
        message: "You are not allowed to delete hypothesis",
      });
    }
    // delete hypothesis
    await hypothesis.remove();
    // return hypothesis
    return res.status(200).json({ message: "Hypothesis deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
