import { useState } from "react";
import { useDarkMode } from "../context/DarkModeContext";

// --- UI Components (Inline for portability) ---

// Modern SVG Icons to replace Emojis
const Icons = {
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ),
  Loader: () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  )
};

/**
 * AuthPage - Modern responsive login/register component
 * Features: Beautiful UI with dark mode, form validation, error handling
 * @param {Function} onLogin - Callback after successful login
 */
const AuthPage = ({ onLogin }) => {
  const { isDarkMode } = useDarkMode();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError(""); 
    setSuccessMessage("");
  };

  // Handle form submission (login or register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        setError("Email and password are required");
        setIsLoading(false);
        return;
      }

      if (!isLogin && !formData.name) {
        setError("Name is required for registration");
        setIsLoading(false);
        return;
      }

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Authentication failed");
        setIsLoading(false);
        return;
      }

      // Handle registration vs login differently
      if (isLogin) {
        // LOGIN
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.token, data.user);
      } else {
        // REGISTRATION
        setSuccessMessage("Account created successfully. Please sign in.");
        setIsLogin(true); 
        setFormData({
          name: "",
          email: formData.email, 
          password: "",
          role: "user"
        });
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  // Theme Constants
  const theme = {
    bg: isDarkMode ? "bg-[#0f172a]" : "bg-[#f8fafc]",
    card: isDarkMode ? "bg-slate-900/60 border-slate-700/50" : "bg-white/70 border-white/50",
    textPrimary: isDarkMode ? "text-slate-100" : "text-slate-800",
    textSecondary: isDarkMode ? "text-slate-400" : "text-slate-500",
    inputBg: isDarkMode ? "bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400",
    inputFocus: "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
    iconColor: isDarkMode ? "text-slate-500" : "text-slate-400",
    accent: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500",
    accentText: "text-indigo-600 hover:text-indigo-500"
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ease-in-out ${theme.bg}`}>
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
         {/* Top Left Blob */}
        <div className={`absolute -top-[20%] -left-[10%] w-[70vh] h-[70vh] rounded-full blur-[100px] opacity-30 animate-pulse ${isDarkMode ? "bg-indigo-900" : "bg-indigo-200"}`} />
        {/* Bottom Right Blob */}
        <div className={`absolute -bottom-[20%] -right-[10%] w-[60vh] h-[60vh] rounded-full blur-[100px] opacity-30 animate-pulse delay-1000 ${isDarkMode ? "bg-violet-900" : "bg-blue-200"}`} />
        {/* Grid Pattern Overlay */}
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay`} />
      </div>

      {/* --- Main Card Container --- */}
      <div className={`w-full max-w-[440px] relative z-10 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border transition-all duration-300 ${theme.card}`}>
        
        <div className="p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 shadow-lg rotate-3 transition-transform hover:rotate-6 ${theme.accent}`}>
              <span className="text-white"><Icons.Bell /></span>
            </div>
            <h1 className={`text-3xl font-bold tracking-tight mb-2 ${theme.textPrimary}`}>
              {isLogin ? "Welcome back" : "Get started"}
            </h1>
            <p className={`text-sm font-medium ${theme.textSecondary}`}>
              {isLogin ? "Enter your details to access your account" : "Start your journey with us today"}
            </p>
          </div>

          {/* Feedback Messages */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-3 text-sm font-medium animate-fade-in">
               <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3 text-sm font-medium animate-fade-in">
               <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Input (Register Only) */}
            {!isLogin && (
              <div className="group space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${theme.textSecondary}`}>Full Name</label>
                <div className="relative transition-all duration-300">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${theme.iconColor} group-focus-within:text-indigo-500`}>
                    <Icons.User />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 outline-none ${theme.inputBg} ${theme.inputFocus}`}
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="group space-y-1">
              <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${theme.textSecondary}`}>Email Address</label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${theme.iconColor} group-focus-within:text-indigo-500`}>
                  <Icons.Mail />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 outline-none ${theme.inputBg} ${theme.inputFocus}`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group space-y-1">
              <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${theme.textSecondary}`}>Password</label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${theme.iconColor} group-focus-within:text-indigo-500`}>
                  <Icons.Lock />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 outline-none ${theme.inputBg} ${theme.inputFocus}`}
                />
              </div>
            </div>

            {/* Role Select (Register Only) */}
            {!isLogin && (
              <div className="group space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${theme.textSecondary}`}>Account Type</label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${theme.iconColor} group-focus-within:text-indigo-500`}>
                    <Icons.Shield />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium appearance-none transition-all duration-200 outline-none cursor-pointer ${theme.inputBg} ${theme.inputFocus}`}
                  >
                    <option value="user">Regular User</option>
                    <option value="admin">Administrator</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${theme.iconColor}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 transform transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${theme.accent} ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <>
                  <Icons.Loader />
                  <span>Processing...</span>
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Footer */}
          <div className="mt-8 text-center">
            <p className={`text-sm ${theme.textSecondary}`}>
              {isLogin ? "New to the platform?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "user"
                  });
                  setError("");
                  setSuccessMessage("");
                }}
                className={`ml-2 font-bold transition-colors ${theme.accentText} focus:outline-none hover:underline`}
              >
                {isLogin ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className={`absolute bottom-6 text-xs font-medium opacity-60 ${theme.textSecondary}`}>
        © 2025 Notification System Inc.
      </div>
    </div>
  );
};

export default AuthPage;