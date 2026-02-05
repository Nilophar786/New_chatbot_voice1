import User from "../models/user.model.js";

export const addTask = async (req, res) => {
  try {
    const { task } = req.body;
    const userId = req.userId;

    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.tasks = user.tasks || [];
    user.tasks.push(task);
    await user.save();

    return res.status(200).json({
      message: "Task added successfully",
      tasks: user.tasks,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to add task",
      details: error.message 
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      tasks: user.tasks || [],
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to get tasks",
      details: error.message 
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskIndex } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (taskIndex < 0 || taskIndex >= (user.tasks || []).length) {
      return res.status(400).json({ error: "Invalid task index" });
    }

    user.tasks.splice(taskIndex, 1);
    await user.save();

    return res.status(200).json({
      message: "Task deleted successfully",
      tasks: user.tasks,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to delete task",
      details: error.message 
    });
  }
};

export const addNote = async (req, res) => {
  try {
    const { note } = req.body;
    const userId = req.userId;

    if (!note) {
      return res.status(400).json({ error: "Note is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.notes = user.notes || [];
    user.notes.push({
      content: note,
      createdAt: new Date()
    });
    await user.save();

    return res.status(200).json({
      message: "Note added successfully",
      notes: user.notes,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to add note",
      details: error.message 
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      notes: user.notes || [],
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to get notes",
      details: error.message
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteIndex } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (noteIndex < 0 || noteIndex >= (user.notes || []).length) {
      return res.status(400).json({ error: "Invalid note index" });
    }

    user.notes.splice(noteIndex, 1);
    await user.save();

    return res.status(200).json({
      message: "Note deleted successfully",
      notes: user.notes,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete note",
      details: error.message
    });
  }
};
