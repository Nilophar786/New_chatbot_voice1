import User from "../models/user.model.js";

export const addReminder = async (req, res) => {
  try {
    const { time, message } = req.body;
    const userId = req.userId;

    if (!time || !message) {
      return res.status(400).json({ error: "Time and message are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.reminders = user.reminders || [];
    user.reminders.push({
      time: new Date(time),
      message,
      active: true
    });
    await user.save();

    return res.status(200).json({
      message: "Reminder added successfully",
      reminders: user.reminders,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to add reminder",
      details: error.message
    });
  }
};

export const getReminders = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      reminders: user.reminders || [],
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to get reminders",
      details: error.message
    });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { reminderIndex } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (reminderIndex < 0 || reminderIndex >= (user.reminders || []).length) {
      return res.status(400).json({ error: "Invalid reminder index" });
    }

    user.reminders.splice(reminderIndex, 1);
    await user.save();

    return res.status(200).json({
      message: "Reminder deleted successfully",
      reminders: user.reminders,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete reminder",
      details: error.message
    });
  }
};
