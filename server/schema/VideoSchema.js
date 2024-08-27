const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
