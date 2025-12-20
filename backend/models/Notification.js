import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["global", "role", "user"],
      required: true
    },

    targetRole: {
      type: String
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
