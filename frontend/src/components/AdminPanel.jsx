import { useState } from "react";
import { useDarkMode } from "../context/DarkModeContext";

// --- Icons (Optimized) ---
const Icons = {
  Global: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  Role: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  ),
  Chevron: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
  ),
  Shield: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  )
};

/**
 * AdminPanel - Premium UI Refactor
 */
const AdminPanel = ({ socket, currentUser }) => {
  const { isDarkMode } = useDarkMode();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "global",
    role: "user",
    userIdentifier: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setNotification("");
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      setNotification("❌ Title and message are required");
      return;
    }

    if (formData.type === "user" && !formData.userIdentifier.trim()) {
      setNotification("❌ Please enter email or username");
      return;
    }

    if (currentUser?.role !== "admin") {
      setNotification("❌ Only administrators can send notifications");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        ...(formData.type === "role" && { role: formData.role }),
        ...(formData.type === "user" && { userIdentifier: formData.userIdentifier })
      };

      const eventName = 
        formData.type === "global" ? "sendGlobalNotification" :
        formData.type === "role" ? "sendRoleNotification" : 
        "sendUserNotification";

      socket.emit(eventName, payload);

      setNotification("✅ Notification sent successfully!");
      setFormData({
        title: "",
        message: "",
        type: "global",
        role: "user",
        userIdentifier: ""
      });

      setIsLoading(false);
      setTimeout(() => setIsExpanded(false), 3000);
    } catch (error) {
      setNotification("❌ Failed to send notification");
      setIsLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== "admin") return null;

  // --- Theme Configuration ---
  const theme = {
    // Container: Glassmorphism effect with better dark mode visibility
    container: isDarkMode 
      ? "bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-[0_20px_70px_rgba(0,0,0,0.5)]" 
      : "bg-white/95 backdrop-blur-xl border-slate-200 shadow-[0_20px_70px_rgba(0,0,0,0.08)]",
    
    // Header
    header: isDarkMode 
      ? "text-slate-100 hover:bg-slate-800/70" 
      : "text-slate-800 hover:bg-slate-50",
    
    // Text Colors - Enhanced contrast for dark mode
    label: isDarkMode ? "text-slate-200" : "text-slate-700",
    inputLabel: isDarkMode ? "text-slate-300" : "text-slate-600",
    
    // Inputs: Better contrast in dark mode
    input: isDarkMode
      ? "bg-slate-800/80 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 focus:bg-slate-800"
      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
    
    // Selection Cards - Enhanced visibility
    cardActive: isDarkMode 
      ? "bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border-indigo-400 text-slate-100 shadow-[0_0_25px_rgba(99,102,241,0.4)] ring-2 ring-indigo-500/20" 
      : "bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-500 text-indigo-700 shadow-lg shadow-indigo-200/50",
    cardInactive: isDarkMode 
      ? "bg-slate-800/60 border-slate-600 text-slate-300 hover:bg-slate-700/70 hover:border-slate-500 hover:shadow-lg" 
      : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 hover:shadow-md"
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-4">
      {/* Main Accordion Container */}
      <div className={`rounded-3xl border transition-all duration-300 overflow-hidden ${theme.container}`}>
        
        {/* Toggle Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full p-6 flex items-center justify-between transition-all duration-300 group relative overflow-hidden ${theme.header}`}
        >
          {/* Animated background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-violet-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-violet-500/5 group-hover:to-indigo-500/5 transition-all duration-500"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
              bg-gradient-to-br from-indigo-500 to-violet-600 text-white
              transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-indigo-500/50
            `}>
              <Icons.Shield />
            </div>
            <div className="text-left">
              <h3 className={`text-xl font-bold tracking-tight transition-all duration-300 group-hover:text-indigo-500 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                Admin Console
              </h3>
              <p className={`text-xs font-medium uppercase tracking-wider mt-1 transition-all duration-300 ${isDarkMode ? "text-slate-400 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-600"}`}>
                Broadcast Center
              </p>
            </div>
          </div>
          
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center relative z-10
            transition-all duration-300 transform
            ${isExpanded 
              ? `rotate-180 ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-500/10 text-indigo-600"}` 
              : `rotate-0 ${isDarkMode ? "text-slate-400 group-hover:bg-slate-700/50" : "text-slate-400 group-hover:bg-slate-100"} group-hover:text-indigo-500`}
          `}>
             <Icons.Chevron className="w-6 h-6" />
          </div>
        </button>

        {/* Expandable Content Area */}
        <div 
          className={`
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
            ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className={`p-6 sm:p-8 border-t ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
            <form onSubmit={handleSendNotification} className="space-y-8">
              
              {/* 1. Audience Selection */}
              <div className="space-y-4">
                <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme.label}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Select Audience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "global", label: "Global", sub: "Everyone", icon: Icons.Global },
                    { id: "role", label: "By Role", sub: "Group", icon: Icons.Role },
                    { id: "user", label: "Direct", sub: "Individual", icon: Icons.User },
                  ].map((item) => (
                    <label 
                      key={item.id} 
                      className={`
                        relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 cursor-pointer 
                        transition-all duration-300 group hover:-translate-y-1.5 hover:scale-[1.02]
                        ${formData.type === item.id ? theme.cardActive : theme.cardInactive}
                      `}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={item.id}
                        checked={formData.type === item.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      
                      {/* Glow effect on active */}
                      {formData.type === item.id && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-sm -z-10"></div>
                      )}
                      
                      <span className={`mb-3 transform transition-all duration-300 ${formData.type === item.id ? "scale-110" : "group-hover:scale-125 group-hover:rotate-6"}`}>
                        <item.icon />
                      </span>
                      <span className="font-bold text-sm transition-all duration-200">{item.label}</span>
                      <span className={`text-[10px] font-medium uppercase mt-1 transition-all duration-200 ${formData.type === item.id ? "opacity-80" : "opacity-50 group-hover:opacity-70"}`}>{item.sub}</span>
                      
                      {/* Check mark for active */}
                      {formData.type === item.id && (
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${isDarkMode ? "bg-indigo-500" : "bg-indigo-600"} animate-scale-in`}>
                          <svg className={`w-3 h-3 ${isDarkMode ? "text-white" : "text-black"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Content & Routing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Col: Target & Title */}
                <div className="space-y-6">
                  {/* Dynamic Target Input */}
                  <div className="h-20 relative"> 
                    {/* Fixed height prevents layout jump */}
                    {formData.type === "global" && (
                       <div className={`h-full flex items-center px-4 rounded-xl border-2 border-dashed transition-all duration-300 animate-fade-in-up ${isDarkMode ? "border-slate-600 bg-slate-800/50 text-slate-300" : "border-slate-300 bg-slate-50 text-slate-600"}`}>
                          <p className="text-sm flex items-center gap-2">
                            <span className="text-lg">🚀</span>
                            <span>This message will be sent to <b className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}>all registered users</b>.</span>
                          </p>
                       </div>
                    )}
                    
                    {formData.type === "role" && (
                      <div className="animate-fade-in-up">
                        <label className={`block text-xs font-bold uppercase mb-2 ${theme.inputLabel}`}>Target Role</label>
                        <div className="relative group">
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className={`w-full px-5 py-3.5 rounded-xl border-2 text-sm outline-none appearance-none cursor-pointer transition-all group-hover:border-indigo-400 ${theme.input}`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Administrator</option>
                          </select>
                          <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${isDarkMode ? "text-slate-400 group-hover:text-indigo-400" : "text-slate-500 group-hover:text-indigo-500"}`}>
                            <Icons.Chevron className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.type === "user" && (
                      <div className="animate-fade-in-up">
                        <label className={`block text-xs font-bold uppercase mb-2 ${theme.inputLabel}`}>User Email / ID</label>
                        <input
                          type="text"
                          name="userIdentifier"
                          value={formData.userIdentifier}
                          onChange={handleInputChange}
                          placeholder="e.g. john@example.com"
                          className={`w-full px-5 py-3.5 rounded-xl border-2 text-sm outline-none transition-all hover:border-indigo-400 ${theme.input}`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${theme.inputLabel}`}>Subject Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., System Maintenance Alert"
                      maxLength={100}
                      className={`w-full px-5 py-3.5 rounded-xl border-2 text-sm outline-none transition-all hover:border-indigo-400 ${theme.input}`}
                    />
                  </div>
                </div>

                {/* Right Col: Message Body */}
                <div className="flex flex-col h-full">
                  <label className={`block text-xs font-bold uppercase mb-2 ${theme.inputLabel}`}>Message Content</label>
                  <div className="relative flex-grow group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Type your broadcast message here..."
                      maxLength={500}
                      className={`w-full h-full min-h-[140px] px-5 py-4 rounded-xl border-2 text-sm resize-none outline-none transition-all hover:border-indigo-400 ${theme.input}`}
                    />
                    <div className={`absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                      formData.message.length > 450 
                        ? isDarkMode ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-rose-100 text-rose-600 border border-rose-300"
                        : isDarkMode ? "bg-slate-700/80 text-slate-300 border border-slate-600" : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {formData.message.length} / 500
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Actions & Feedback */}
              <div className="pt-4 border-t border-dashed border-slate-200 dark:border-slate-700">
                {notification && (
                  <div className={`
                    mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold animate-slide-down
                    ${notification.includes("✅") 
                      ? isDarkMode ? "bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/20" : "bg-emerald-50 border-2 border-emerald-300 text-emerald-700 shadow-lg shadow-emerald-200/50"
                      : isDarkMode ? "bg-rose-500/20 border-2 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-500/20" : "bg-rose-50 border-2 border-rose-300 text-rose-700 shadow-lg shadow-rose-200/50"
                    }
                  `}>
                    <span className="text-xl animate-bounce">{notification.includes("✅") ? "🎉" : "⚠️"}</span>
                    <span>{notification}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    relative w-full py-4 rounded-xl font-bold text-white shadow-lg overflow-hidden
                    transition-all duration-200 transform active:scale-[0.98]
                    flex items-center justify-center gap-2 group
                    ${isLoading 
                      ? "bg-slate-600 cursor-not-allowed opacity-70" 
                      : "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-size-200 hover:bg-right-bottom hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1"
                    }
                  `}
                >
                  {/* Animated shine effect */}
                  {!isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  )}
                  
                  <div className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Broadcasting...</span>
                      </>
                    ) : (
                      <>
                        <Icons.Send />
                        <span>Push Notification</span>
                        <span className="opacity-0 -ml-4 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0">→</span>
                      </>
                    )}
                  </div>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .bg-size-200 {
          background-size: 200% 100%;
          background-position: left bottom;
        }
        
        .hover\\:bg-right-bottom:hover {
          background-position: right bottom;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;