import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Event {
  id: number;
  title: string;
  image?: string | null;
  user_profile_pic: string;
  date: string;
  address: string;
  category: string;
}

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch events from API
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/events/all`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Upload image & update event
  const uploadImage = async () => {
    if (!selectedFile || !selectedEventId) return alert("Please select an event and a file.");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // 1️⃣ Upload the image to the server
      const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formData);
      const imageUrl = uploadResponse.data.url; // Assuming API returns { url: "https://image-link.jpg" }

      // 2️⃣ Update the event with the image URL
      await axios.patch(`${API_BASE_URL}/events/${selectedEventId}`, { image: imageUrl });

      // 3️⃣ Update local state to reflect the change
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEventId ? { ...event, image: imageUrl } : event
        )
      );

      alert("Image uploaded successfully!");
      setSelectedFile(null); // Reset file selection
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
          <li key={event.id} style={{ marginBottom: "10px" }}>
            <strong>{event.title}</strong>
            <p>{event.category} - {event.address}</p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            {event.image ? (
              <img src={event.image} alt="Event" width="100" />
            ) : (
              <p>No Image Available</p>
            )}
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
