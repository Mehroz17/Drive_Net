import Issue from "../models/Issue.js";

/* CREATE */
export const createIssue = async (req, res) => {
  try {
    const { userId, vehicleAdId, category, details, userInfo, sellerId } = req.body; // Add title
    const newIssue = new Issue({
      userId, 
      vehicleAdId,
      sellerId,
      category,
      details,
      userInfo
    });

    await newIssue.save();  
    res.status(201).json(newIssue);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const updateIssue = async (req, res) => {
  try {
    const {issuesList} = req.body;
    for (const issue of issuesList){
      const status = issue.status;
      const id = issue._id;
      const updatedIssue = await Issue.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedIssue) {
        return res.status(404).json({ message: "Issue not found" });
      }
    }
    res.status(200).json({msg: 'ok'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE */
export const deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
