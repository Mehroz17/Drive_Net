import User from "../models/User.js";
import VehicleAd from "../models/VehicleAd.js";
import Issue from "../models/Issue.js";

export const getReport = async (req, res) => {
  try {
    const usersN = await User.countDocuments();
    const vehiclesN = await VehicleAd.countDocuments();
    const vehiclesSoldN = await VehicleAd.countDocuments({status: 'sold'});
    const issuesN = await Issue.countDocuments();
    const issuesResolvedN = await Issue.countDocuments({status: 'resolved'});

    const report = {
      usersN,
      vehiclesN,
      vehiclesSoldN,
      issuesN,
      issuesResolvedN
    }
    res.status(200).json(report);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};