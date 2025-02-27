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
  price?: string;
  dateEnd: string;
  ticketUrl: string;
}

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [userProfessional, setUserProfessional] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [ticketUrl, setTicketUrl] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/events/all`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

const handleSelectEvent = (eventId: number) => {
  console.log("Selected Event ID:", eventId);
  setSelectedEventId((prevSelectedEventId) => (prevSelectedEventId === eventId ? null : eventId));
};

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const handleUserProfessionalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfessional(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleDateEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateEnd(event.target.value);
  };

  const handleTicketUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicketUrl(event.target.value);
  };

  const uploadImage = async () => {
    if (!selectedEventId) {
      alert("Please select an event.");
      return;
    }

    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    if (title) formData.append("title", title);
    if (price) formData.append("price", price);
    if (userProfessional) formData.append("user_professional", userProfessional);
    if (date) formData.append("date", date);
    if (dateEnd) formData.append("date_end", dateEnd);
    if (ticketUrl) formData.append("ticket_url", ticketUrl);

    console.log("Uploading image for event ID:", selectedEventId);

    try {
      const response = await axios.patch(`${API_BASE_URL}/events/${selectedEventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedEvent = response.data.event;

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEventId ? { ...event, image: updatedEvent.image, title: updatedEvent.title, price: updatedEvent.price, user_professional: updatedEvent.user_professional, date: updatedEvent.date, date_end: updatedEvent.date_end, ticket_url: updatedEvent.ticket_url } : event
        )
      );

      alert(`Event with ID ${selectedEventId} updated successfully!`);
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
          <div
            key={event.id}
            className="event-item"
            style={{
              border: selectedEventId === event.id ? "2px solid blue" : "1px solid gray",
            }}
          >
            <strong>{event.title}</strong>
            <p>Category: {event.category}</p>
            <p>Address: {event.address}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Date End: {new Date(event.dateEnd).toLocaleDateString()}</p>
            <p>User Profile Pic: <img src={event.user_profile_pic} alt="User Profile" width="50" /></p>
            <p>Ticket URL: <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">{event.ticketUrl}</a></p>
            <p>Price: {event.price}</p>
            <p>Image: {event.image ? <img src={event.image} alt="Event" width="100" /> : "No Image Available"}</p>
            <button onClick={() => handleSelectEvent(event.id)}>
              {selectedEventId === event.id ? "Selected ✅" : "Select"}
            </button>

            {/* Upload UI appears next to the selected event */}
            {selectedEventId === event.id && (
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input type="file" onChange={handleFileChange} />
                <input type="text" placeholder="Title" value={title} onChange={handleTitleChange} />
                <input type="text" placeholder="Price" value={price} onChange={handlePriceChange} />
                <input type="text" placeholder="User Professional" value={userProfessional} onChange={handleUserProfessionalChange} />
                <input type="text" placeholder="Date" value={date} onChange={handleDateChange} />
                <input type="text" placeholder="Date End" value={dateEnd} onChange={handleDateEndChange} />
                <input type="text" placeholder="Ticket URL" value={ticketUrl} onChange={handleTicketUrlChange} />
                <button onClick={uploadImage} style={{ marginTop: "5px" }}>Upload</button>
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
