import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import visitRoutes from './routes/visits.js'
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import issueRoutes from "./routes/issues.js";
import eventRoutes from "./routes/events.js";
import vehicleAdRoutes from "./routes/vehicleAds.js";
import ChatRoute from './routes/ChatRoute.js'
import MessageRoute from './routes/MessageRoute.js'
import reportRoutes from './routes/report.js'
import vehicleRoutes from './routes/vehicles.js'
import locationRoutes from './routes/location.js'

import { addPhones, register} from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { createVehicleAd, updateVehicleAd} from "./controllers/vehicleAds.js"
import { createEvent} from "./controllers/events.js"
import { updateUser, changePassword } from "./controllers/users.js";


import { verifyToken, verifyTokenForPasswordChange } from "./middleware/auth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});


/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.get("/auth/register", addPhones);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post("/events/create", verifyToken, upload.single("picture"), createEvent);
app.post("/vehiclead/create",verifyToken, upload.array("images", 12), createVehicleAd);
app.patch("/vehiclead/update",verifyToken, upload.array("images", 12), updateVehicleAd);
app.patch("/users/:id", verifyToken, upload.single("picture"), updateUser);   
app.patch("/users/:id/changePass", verifyTokenForPasswordChange, changePassword);   


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/events", eventRoutes);
app.use("/issues", issueRoutes);
app.use("/market", vehicleAdRoutes);
app.use("/chat", ChatRoute);
app.use('/message', MessageRoute);
app.use('/report', reportRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/location', locationRoutes);
app.use('/visits', visitRoutes);


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect('mongodb://localhost:27017/kun_drivenet', {
    // .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    //User.insertMany(users);
    //Post.insertMany(posts); 
  })
  .catch((error) => console.log(`${error} did not connect`));