# 🚀 QUICK START GUIDE

## For First Time Users

### Step 1: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Step 2: Start Backend
```bash
cd backend
npm run dev
```
✅ Backend should be running on `http://localhost:5000`

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend should open automatically at `http://localhost:5173`

### Step 4: Create an Admin Account
1. Click **"Sign Up"**
2. Fill in:
   - Name: Admin User
   - Email: admin@test.com
   - Password: admin123
   - Account Type: **Administrator**
3. Click **"Create Account"**

### Step 5: Test Dark Mode
- Click the 🌙 icon in the header to toggle dark mode

### Step 6: Send a Notification
1. Expand the **"Admin Panel"**
2. Enter:
   - Title: "Welcome!"
   - Message: "This is your first notification"
   - Type: Global
3. Click **"Send Notification"**

### Step 7: View Notification
- You should see the notification appear instantly!
- Click on it to mark as read

## 🎨 What You'll See

### Light Mode
- Clean white background with subtle gradients
- Purple-blue accent colors
- Easy on the eyes

### Dark Mode
- Dark gray/black background
- Same purple-blue accents
- Perfect for night-time use

## 📝 Key Features to Try

1. **Register Multiple Users** - Test user-specific notifications
2. **Send Different Notification Types:**
   - Global (everyone sees it)
   - Role-Based (only admins or only users)
   - User-Specific (target one user by their ID)
3. **Mark Notifications as Read** - Click on any notification
4. **Toggle Dark Mode** - Click 🌙/☀️ icon
5. **Logout and Login** - Your notifications persist!

## 🔧 Troubleshooting

### Backend won't start?
- Check MongoDB connection in `backend/.env`
- Ensure MongoDB Atlas is accessible

### Frontend won't connect?
- Check `frontend/.env` has correct URLs
- Ensure backend is running first

### Can't send notifications?
- Make sure you're logged in as an **Administrator**
- Check browser console for errors

## 📱 Test on Mobile

1. Find your local IP (e.g., 192.168.1.100)
2. Update `frontend/.env`:
   ```
   VITE_API_URL=http://192.168.1.100:5000
   VITE_SOCKET_URL=http://192.168.1.100:5000
   ```
3. Access from your phone: `http://192.168.1.100:5173`

## 🎯 Next Steps

1. Read [README.md](README.md) for detailed documentation
2. Check [CHANGELOG.md](CHANGELOG.md) to understand all changes
3. Explore the code - every file has detailed comments!

## 💡 Pro Tips

- **Use DevTools** - Open browser console to see socket events
- **Test Responsiveness** - Resize your browser window
- **Try Both Themes** - Compare light and dark mode
- **Create Multiple Accounts** - Test different roles

---

**Have fun exploring! 🎉**
