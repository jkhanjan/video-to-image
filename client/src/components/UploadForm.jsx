import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const UploadForm = ({ onUploadSuccess }) => {
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [frames, setFrames] = useState([]); // State to hold frame images

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    // Generate a preview URL for the video
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", video);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/videos/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { videoId, message, framePaths } = res.data;

      if (onUploadSuccess) {
        onUploadSuccess(videoId); // Pass videoId to parent component
      }

      setUploadMessage(message); // Update upload message
      setFrames(framePaths); // Update frame paths
    } catch (err) {
      console.error(err);
      setUploadMessage("Error uploading video"); // Handle errors
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input className="mt-10 bg-transparent rounded-xl p-5 text-2xl flex ml-4" type="file" accept="video/*" onChange={handleFileChange} />
        {videoPreview && (
          <div style={{ marginTop: "10px" }}>
            <video
              controls
              src={videoPreview}
              style={{ width: "40%", maxHeight: "400px" }}
            />
          </div>
        )}
        <button type="submit" className="p-4 bg-green-300 rounded-3xl">Upload Video</button>
        {uploadMessage && (
          <p className="text-2xl font-mono" style={{ marginTop: "10px" }}>{uploadMessage}</p> // Display the message
        )}
      </form>
      {/* <div style={{ marginTop: "20px" }}>
        {frames.length > 0 ? (
          frames.map((frame, index) => (
            <img
              key={index}
              src={`http://localhost:5000/uploads/${frame.path}`}
              alt={`Frame ${index}`}
              style={{ width: "100px", height: "auto", margin: "5px" }}
            />
          ))
        ) : (
          <p>No frames available</p>
        )}
      </div> */}
    </div>
  );
};

UploadForm.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default UploadForm;
