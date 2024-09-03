import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const UploadForm = ({ onUploadSuccess }) => {
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [frames, setFrames] = useState([]);
  const [count, setCount] = useState(20);
  const [size, setSize] = useState("1920x1240");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state
    const formData = new FormData();
    formData.append("video", video);
    formData.append("count", count);
    formData.append("size", size);

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
        onUploadSuccess(videoId);
      }

      setUploadMessage(message);
      setFrames(framePaths);
    } catch (err) {
      console.error(err);
      setUploadMessage("Error uploading video");
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="mt-10 bg-transparent rounded-xl p-5 text-2xl flex ml-4"
        />
        <div className="flex gap-4">
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Number of frames"
            className="p-2 rounded"
          />
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Frame size (e.g., 1920x1240)"
            className="p-2 rounded"
          />
        </div>
        {videoPreview && (
          <div style={{ marginTop: "10px" }}>
            <video
              controls
              src={videoPreview}
              style={{ width: "40%", maxHeight: "400px" }}
            />
          </div>
        )}
        <button type="submit" className="p-4 bg-green-300 rounded-3xl">
          Upload Video
        </button>
        {uploadMessage && (
          <p className="text-2xl font-mono" style={{ marginTop: "10px" }}>
            {uploadMessage}
          </p>
        )}
      </form>

      {isLoading && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p className="text-2xl font-mono">Processing video, please wait...</p>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        {frames.length > 0 && !isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "10px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {frames.map((frame, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <img
                  src={`http://localhost:5000/${frame.replace(/\\/g, "/")}`}
                  alt={`Frame ${index}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <a
                  href={`http://localhost:5000/${frame.replace(/\\/g, "/")}`}
                  download={`frame-${index}.png`}
                  style={{
                    display: "inline-block",
                    marginTop: "5px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    fontSize: "12px",
                  }}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && <p>No frames available</p>
        )}
      </div>
    </div>
  );
};

UploadForm.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default UploadForm;
