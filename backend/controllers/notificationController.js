import Notification from "../models/Notification.js";

// GET user notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      $or: [
        { type: "global" },
        { type: "role", targetRole: req.user.role },
        { type: "user", targetUser: userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK AS READ
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;

    await Notification.findByIdAndUpdate(notificationId, {
      $addToSet: { readBy: userId }
    });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
