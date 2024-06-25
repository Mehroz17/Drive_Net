import mongoose from "mongoose";

const userInfoSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

const issueSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vehicleAdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleAd',
      required: true
    },
    details: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'processing', 'resolved'],
      default: 'new',
    },
    userInfo: {
      type: userInfoSchema,

    }
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
