# 🔔 Real-Time Notification System

A modern, full-stack MERN application with real-time notifications powered by Socket.IO. Features a beautiful, responsive UI with dark mode support.

## ✨ Features

### 🎨 UI/UX Features
- **Modern, Professional Design** - Clean and trendy interface built with Tailwind CSS
- **Dark/Light Mode** - Seamless theme switching with persistent preferences
- **Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- **Smooth Animations** - Engaging transitions and hover effects
- **Professional Color Scheme** - Purple and blue gradient themes

### 🔐 Authentication
- Secure JWT-based authentication
- User registration and login
- Role-based access (Admin/User)
- Protected routes and API endpoints

### 📬 Notification System
- **Real-time notifications** via Socket.IO
- **Three notification types:**
  - 🌍 Global - Sent to all users
  - 👥 Role-based - Sent to specific user roles
  - 👤 User-specific - Sent to individual users
- Mark notifications as read
- Persistent notification history
- Unread notification badges

### 👨‍💼 Admin Panel
- Send notifications to all users, specific roles, or individuals
- Beautiful, expandable admin interface
- Form validation and error handling
- Success/error feedback

## 🛠️ Technology Stack

### Frontend
- **React** 19.x - Modern UI library
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
notification-system/
├── backend/
│   ├── controllers/
│   │   ├── authControllers.js      # Authentication logic
│   │   └── notificationController.js # Notification CRUD
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   └── Notification.js         # Notification schema
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   └── notificationRoutes.js   # Notification endpoints
│   ├── .env                        # Environment variables
│   ├── .env.example               # Environment template
│   ├── package.json
│   └── server.js                   # Main server file
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthPage.jsx        # Login/Register UI
    │   │   └── AdminPanel.jsx      # Admin notification panel
    │   ├── context/
    │   │   └── DarkModeContext.jsx # Dark mode provider
    │   ├── App.jsx                 # Main app component
    │   ├── main.jsx                # Entry point
    │   ├── socket.js               # Socket.IO configuration
    │   └── index.css               # Global styles
    ├── .env                        # Environment variables
    ├── .env.example               # Environment template
    ├── package.json
    ├── tailwind.config.js          # Tailwind configuration
    └── vite.config.js              # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Edit .env and add your values:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret_key
   ```

4. **Start the backend server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Or production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Edit .env (default values work for local development):
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## 📝 Usage Guide

### First Time Setup

1. **Register a new account:**
   - Navigate to `http://localhost:5173`
   - Click "Sign Up"
   - Fill in your details
   - Select "Administrator" role to send notifications
   - Click "Create Account"

2. **Login:**
   - Use your credentials to sign in
   - You'll be redirected to the main dashboard

### Sending Notifications (Admin Only)

1. **Access Admin Panel:**
   - Login with an admin account
   - The admin panel appears at the top of the dashboard

2. **Send a notification:**
   - Click to expand the admin panel
   - Enter a title and message
   - Select notification type (Global/Role-Based/User-Specific)
   - Click "Send Notification"

### Receiving Notifications

- Notifications appear automatically in real-time
- Unread notifications have a pulsing indicator
- Click on a notification to mark it as read
- All notifications are stored in your history

### Dark Mode

- Click the 🌙/☀️ icon in the header to toggle dark/light mode
- Your preference is automatically saved

## 🎨 UI Customization

### Changing Colors

The app uses Tailwind CSS with a purple-blue gradient theme. To customize:

**Edit** [tailwind.config.js](frontend/tailwind.config.js):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
      }
    }
  }
}
```

### Modifying Styles

Global styles are in [index.css](frontend/src/index.css). Component-specific styles use Tailwind utility classes.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Notifications
- `GET /api/notifications` - Get user's notifications (requires auth)
- `PATCH /api/notifications/:id/read` - Mark notification as read (requires auth)

### Socket Events

**Client → Server:**
- `sendGlobalNotification` - Send global notification (admin only)
- `sendRoleNotification` - Send role-based notification (admin only)
- `sendUserNotification` - Send user-specific notification (admin only)

**Server → Client:**
- `receiveNotification` - Receive new notification

## 🌐 Deployment

### Deploy to Render (Backend)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Add environment variables:** `MONGO_URI`, `JWT_SECRET`, `PORT`

### Deploy to Vercel (Frontend)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Add environment variables:** 
     - `VITE_API_URL=https://your-backend.onrender.com`
     - `VITE_SOCKET_URL=https://your-backend.onrender.com`

## 🐛 Troubleshooting

### Socket Connection Issues
- Ensure backend is running and accessible
- Check that URLs in `.env` are correct
- Verify CORS settings in `server.js`

### Authentication Errors
- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET matches between backend and stored tokens
- Ensure MongoDB connection is active

### Styling Issues
- Run `npm install` in frontend to ensure Tailwind is installed
- Clear browser cache
- Check that `index.css` is imported in `main.jsx`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👏 Credits

Built with ❤️ using MERN stack, Socket.IO, and Tailwind CSS.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Happy Coding! 🚀**
