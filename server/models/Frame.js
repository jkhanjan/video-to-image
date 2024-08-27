const mongoose = require("mongoose");

const FrameSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
  path: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

module.exports = mongoose.model("Frame", FrameSchema);
