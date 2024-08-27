const multer = require("multer");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Frame = require("../schema/frameSchema.js");
const Video = require("../schema/VideoSchema.js");

// Configure Multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const uploadVideo = async (req, res) => {
  const videoPath = req.file.path;

  try {
    // Save video details to the database
    const video = new Video({
      filename: req.file.filename,
      path: videoPath,
    });
    await video.save();

    // Array to hold the filenames of the extracted frames
    const framePaths = [];

    // Extract frames and save to database
    ffmpeg(videoPath)
      .screenshots({
        count: 20,
        folder: "uploads/",
        filename: "frame-%i.png",
        size: "1920x1240",
      })
      .on("filenames", async (filenames) => {
        console.log("Will generate " + filenames.join(", "));

        // Save frame data to MongoDB and record the frame paths
        try {
          for (let index = 0; index < filenames.length; index++) {
            const framePath = path.join("uploads", filenames[index]);
            framePaths.push(framePath); // Add the frame path to the array

            const frame = new Frame({
              videoId: video._id,
              path: framePath,
              timestamp: index,
            });
            await frame.save();
          }
        } catch (err) {
          console.error("Error saving frames:", err);
          return res.status(500).json({ message: "Error saving frames" });
        }
      })
      .on("end", () => {
        console.log("Screenshots taken");
        res.status(200).json({
          videoId: video._id,
          message: "Done, creating the image",
          framePaths: framePaths, // Include framePaths in the response
        });
      })
      .on("error", (err) => {
        console.error("Error processing video:", err);
        res.status(500).json({ message: "Error processing video" });
      });
  } catch (err) {
    console.error("Error uploading video:", err);
    res.status(500).json({ message: "Error uploading video" });
  }
};

module.exports = {
  upload,
  uploadVideo,
};
