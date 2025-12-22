import { useEffect, useState } from "react";
import { connectSocket } from "./socket";
import AuthPage from "./components/AuthPage";
import AdminPanel from "./components/AdminPanel";
import { useDarkMode } from "./context/DarkModeContext";

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* ---------------- RESTORE USER ON REFRESH ---------------- */
  useEffect(() => {
    if (!currentUser && token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, [token, currentUser]);

  /* ---------------- LOGIN HANDLER ---------------- */
  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  /* ---------------- LOGOUT HANDLER ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setNotifications([]);
    if (socket) socket.disconnect();
    setSocket(null);
  };

  /* ---------------- FETCH OLD NOTIFICATIONS ---------------- */
  useEffect(() => {
    if (!token || !currentUser) return;

    setIsLoading(true);
    setError("");

    fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setNotifications(data || []);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch notifications");
        setIsLoading(false);
      });
  }, [token, currentUser]);

  /* ---------------- SOCKET CONNECTION ---------------- */
  useEffect(() => {
    if (!token || !currentUser) return;

    const socketInstance = connectSocket(token);

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socketInstance.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    socketInstance.on("connect_error", () => {
      setError("Socket authentication failed");
    });

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, [token, currentUser]);

  /* ---------------- MARK AS READ ---------------- */
  const markAsRead = async (id) => {
    if (!token || !currentUser) return;

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id
          ? { ...n, readBy: [...(n.readBy || []), currentUser._id] }
          : n
      )
    );
  };

  /* ---------------- AUTH PAGE ---------------- */
  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-gray-50 via-white to-gray-50"}`}>
      <header className={`p-6 flex justify-between items-center border-b backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${
        isDarkMode 
          ? "bg-slate-900/80 border-slate-700 shadow-lg shadow-black/20" 
          : "bg-white/80 border-slate-200 shadow-md shadow-slate-200/50"
      }`}>
        <h2 className={`text-2xl font-bold flex items-center gap-2 transition-colors ${
          isDarkMode ? "text-slate-100" : "text-slate-900"
        }`}>
          <span className="text-3xl animate-pulse">🔔</span>
          Notifications
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
              isDarkMode 
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40" 
                : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
            }`}
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button 
            onClick={handleLogout}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
              isDarkMode 
                ? "bg-slate-700/80 text-slate-200 border-2 border-slate-600 hover:bg-slate-600/80 hover:border-slate-500" 
                : "bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-md"
            }`}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {error && (
          <div className={`p-4 mb-6 rounded-xl border-2 flex items-center gap-3 animate-shake ${
            isDarkMode 
              ? "bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-500/20" 
              : "bg-rose-50 border-rose-300 text-rose-700 shadow-lg shadow-rose-200/50"
          }`}>
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {socket && currentUser.role === "admin" && (
          <AdminPanel socket={socket} currentUser={currentUser} />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className={`font-medium ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}>Loading notifications...</p>
            </div>
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${
            isDarkMode 
              ? "border-slate-700 bg-slate-800/30 text-slate-400" 
              : "border-slate-300 bg-slate-50 text-slate-500"
          }`}>
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-lg font-medium">No notifications yet</p>
          </div>
        )}

        {!isLoading &&
          notifications.map((n) => {
            const isRead = n.readBy?.includes(currentUser._id);

            return (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`group p-5 mb-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${
                  isDarkMode
                    ? isRead
                      ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 hover:shadow-lg"
                      : "bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border-indigo-500/50 hover:border-indigo-400 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                    : isRead
                      ? "bg-slate-100 border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:shadow-md"
                      : "bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-300 hover:border-indigo-400 shadow-md hover:shadow-lg shadow-indigo-200/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg mb-2 transition-colors ${
                      isDarkMode 
                        ? isRead ? "text-slate-300" : "text-slate-100" 
                        : isRead ? "text-slate-700" : "text-slate-900"
                    }`}>
                      {n.title}
                    </h4>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isDarkMode 
                        ? isRead ? "text-slate-400" : "text-slate-300" 
                        : isRead ? "text-slate-600" : "text-slate-700"
                    }`}>
                      {n.message}
                    </p>
                  </div>
                  
                  {!isRead && (
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${
                        isDarkMode ? "bg-indigo-400" : "bg-indigo-600"
                      }`}></div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}>
                        New
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Hover indicator */}
                <div className={`mt-3 pt-3 border-t text-xs font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDarkMode ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400"
                }`}>
                  {isRead ? "✓ Read" : "Click to mark as read"}
                </div>
              </div>
            );
          })}
      </main>
    </div>
  );
}

export default App;
