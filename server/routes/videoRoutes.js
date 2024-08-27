const express = require("express");
const { upload, uploadVideo } = require("../controllers/videoController.js");
const Frame = require("../schema/frameSchema.js");
const router = express.Router();

// Route to handle video upload
router.post("/upload", upload.single("video"), uploadVideo);

module.exports = router;
