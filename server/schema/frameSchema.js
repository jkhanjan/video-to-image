const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const frameSchema = new Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video", // Reference to the Video model
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

const Frame = mongoose.model("Frame", frameSchema);
module.exports = Frame;
