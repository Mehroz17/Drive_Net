import Event from "../models/Event.js";

/* CREATE */
export const createEvent = async (req, res) => {
  try {
    const { title, description, datetime, picture, picturePath } = req.body;

    const newEvent = new Event({
      datetime,
      title,
      description,
      picture: picturePath,
      venue: 'lahore',
      interestedUsers: {}
    });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* INTEREST */
export const interestEvent = async (req, res) => {
  const { eventId, userId } = req.params;
  console.log(eventId, userId)
  try {
      const event = await Event.findById(eventId);
      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      const userInterest = event.interestedUsers?.get(userId);
      console.log(userInterest);
       
      event.interestedUsers.set(userId, !userInterest);

      await event.save();

      res.status(200).json({ message: "Interest status updated", interested: !userInterest });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

/* DELETE */
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
