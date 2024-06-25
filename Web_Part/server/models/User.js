import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {

    status: {
      type: Number,
      required: true,
      default: 1,
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    role: {
      type: String,
      default: 'user'
    },
    phone: {
      type: String,
      required: true,
      min: 11,
      max: 11,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    profileViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

const User = mongoose.model("User", UserSchema);
export default User;
