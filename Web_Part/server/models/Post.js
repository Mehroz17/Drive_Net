
import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Store only userId
      ref: 'User',
      required: true,
    },
    title: String, 
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: String,
      },
    ],
    // Define additional fields for user details
    firstName: String,
    lastName: String,
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;