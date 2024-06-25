import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      phone,
      occupation,
    } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If the email already exists, return a 400 status code with an error message
      return res.status(400).json({ error: "Email is already registered." });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      // If the email already exists, return a 400 status code with an error message
      return res.status(400).json({ error: "Phone Number is already registered." });
    }

    // Continue with user registration
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      phone,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//temporary function just to add dummy phones for existing users
export const addPhones = async (req, res) => {
  try {
    const users = await User.find();
    for (const user of users) {
      user.phone = "0301 " + Math.floor(Math.random() * 10000000);
      await user.save();
    }
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    if (user.status == 0){
      return res.status(400).json({ msg: "User blocked by admin! " });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    //console.log(isMatch);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
