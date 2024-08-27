import { useState } from "react";
import UploadForm from "./components/UploadForm";

function App() {
  const [videoId, setVideoId] = useState(null);

  const handleUploadSuccess = (id) => {
    setVideoId(id);
  };

  return (
    <div className="App w-full h-screen flex items-center pt-[10%] flex-col">
      <h1 className="text-6xl tracking-tighter">Video to Frame Converter</h1>
      <UploadForm onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}

export default App;
