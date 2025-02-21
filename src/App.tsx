import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://your-api.com"; // Replace with your actual API

function App() {
  const [events, setEvents] = useState<{ id: string; name: string; image?: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/events`).then((res) => setEvents(res.data));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile || !selectedEventId) return alert("Please select an event and a file.");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Upload image (Assuming your API can handle this)
      const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formData);
      const imageUrl = uploadResponse.data.url;

      // Update the event with the image URL
      await axios.patch(`${API_BASE_URL}/events/${selectedEventId}`, { image: imageUrl });

      alert("Image uploaded successfully!");
      setEvents((prev) =>
        prev.map((event) => (event.id === selectedEventId ? { ...event, image: imageUrl } : event))
      );
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Event Image Uploader</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.name}</strong> 
            {event.image && <img src={event.image} alt="Event" width="100" />}
            <button onClick={() => setSelectedEventId(event.id)}>Select</button>
          </li>
        ))}
      </ul>

      {selectedEventId && (
        <div>
          <h3>Upload Image for Selected Event</h3>
          <input type="file" onChange={handleFileChange} />
          <button onClick={uploadImage}>Upload</button>
        </div>
      )}
    </div>
  );
}

export default App;
