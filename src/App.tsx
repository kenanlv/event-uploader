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

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/events/all`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const handleSelectEvent = (eventId: number) => {
    console.log("Selected Event ID:", eventId);
    setSelectedEventId(eventId);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile || !selectedEventId) {
      alert("Please select an event and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    console.log("Uploading image for event ID:", selectedEventId);

    try {
      const response = await axios.patch(`${API_BASE_URL}/events/${selectedEventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedEvent = response.data.event;

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEventId ? { ...event, image: updatedEvent.image } : event
        )
      );

      alert("Image uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Event Image Uploader</h2>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {events.map((event) => (
          <li
            key={event.id}
            style={{
              marginBottom: "10px",
              border: selectedEventId === event.id ? "2px solid blue" : "1px solid gray",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: 1 }}>
              <strong>{event.title}</strong>
              <p>{event.category} - {event.address}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              {event.image ? (
                <img src={event.image} alt="Event" width="100" />
              ) : (
                <p>No Image Available</p>
              )}
              <button onClick={() => handleSelectEvent(event.id)}>
                {selectedEventId === event.id ? "Selected ✅" : "Select"}
              </button>
            </div>

            {/* Upload UI appears next to the selected event */}
            {selectedEventId === event.id && (
              <div style={{ marginLeft: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input type="file" onChange={handleFileChange} />
                <button onClick={uploadImage} style={{ marginTop: "5px" }}>Upload</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
