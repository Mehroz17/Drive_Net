import Visit from '../models/Visit.js';

export const incrementVisit = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Find the visit document for today or create a new one if it doesn't exist
    const visit = await Visit.findOneAndUpdate(
      { date: today },
      { $inc: { visits: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json(visit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getLastSevenDaysVisits = async (req, res) => {
  try {
    // Calculate the dates for the last seven days
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Query the database for visits on those dates
    const visits = await Visit.find({ date: { $in: dates } }).sort({ date: 1 });

    // Create a map of dates to visits
    const visitMap = new Map(visits.map(visit => [visit.date, visit.visits]));

    // Create the result array
    const result = dates.map(date => ({
      date,
      visits: visitMap.get(date) || 0
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};