import { useState } from "react";

const AdminPanel = ({ socket }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("global");
  const [role, setRole] = useState("user");
  const [userId, setUserId] = useState("");

  const sendNotification = () => {
    if (!title || !message) return alert("Title & message required");

    if (type === "global") {
      socket.emit("sendGlobalNotification", { title, message });
    }

    if (type === "role") {
      socket.emit("sendRoleNotification", { title, message, role });
    }

    if (type === "user") {
      socket.emit("sendUserNotification", { title, message, userId });
    }

    setTitle("");
    setMessage("");
  };

  return (
    <div style={{ border: "1px solid #444", padding: "20px", marginBottom: "20px" }}>
      <h3>Admin Notification Panel</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br /><br />

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      /><br /><br />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="global">Global</option>
        <option value="role">Role Based</option>
        <option value="user">User Specific</option>
      </select>

      <br /><br />

      {type === "role" && (
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )}

      {type === "user" && (
        <input
          placeholder="Target User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      )}

      <br /><br />

      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default AdminPanel;
