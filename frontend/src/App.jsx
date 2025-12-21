import { useEffect, useState } from "react";
import { connectSocket } from "./socket";

function App() {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // TEMP: hardcoded token (later from login)
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const socketInstance = connectSocket(token);

    socketInstance.on("connect", () => {
      console.log("Socket connected");
    });

    socketInstance.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔔 Notifications</h2>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map((n, index) => (
        <div key={index} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
          <h4>{n.title}</h4>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
