const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const videoRoutes = require("./routes/videoRoutes.js");
const cors = require("cors");
const { getFrames } = require("./controllers/videoController.js");

dotenv.config();

// Initialize Express
const app = express();
const router = express.Router();

// Middleware for JSON parsing
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Use routes
app.use(cors());
app.use("/api/videos", videoRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
