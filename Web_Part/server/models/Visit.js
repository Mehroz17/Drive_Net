import mongoose from "mongoose";

// Define the visit schema
const visitSchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      // Validate that the date is in YYYY-MM-DD format
      match: /^\d{4}-\d{2}-\d{2}$/
    },
    visits: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

// Create the Visit model
const Visit = mongoose.model("Visit", visitSchema);

export default Visit;
