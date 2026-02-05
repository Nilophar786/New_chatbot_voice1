import express from "express";
import { askToAssistant, getCurrentUser, updateAssistant, saveCustomization } from "../controllers/user.controllers.js";
import { solveMath, convertCurrency } from "../controllers/math.controllers.js";
import { searchWeb, getWikipediaSummary, getWeather } from "../controllers/search.controllers.js";
import { getJoke, getQuote } from "../controllers/entertainment.controllers.js";
import { addTask, getTasks, deleteTask, addNote, getNotes, deleteNote } from "../controllers/productivity.controllers.js";
import { addReminder, getReminders, deleteReminder } from "../controllers/reminder.controllers.js";
import { getTeachers, startTeacherLesson, submitLessonAnswers, getTeacherProgress, askTeacher, getTeacherRoadmap, startRoadmapLesson, completeRoadmapLesson } from "../controllers/teacher.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// Existing routes
userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);
userRouter.post("/asktoassistant", isAuth, askToAssistant);

// New AI feature routes
userRouter.post("/solve-math", isAuth, solveMath);
userRouter.post("/convert-currency", isAuth, convertCurrency);
userRouter.post("/search-web", isAuth, searchWeb);
userRouter.post("/wikipedia", isAuth, getWikipediaSummary);
userRouter.post("/weather", isAuth, getWeather);
userRouter.post("/joke", isAuth, getJoke);
userRouter.post("/quote", isAuth, getQuote);

// Productivity routes
userRouter.post("/tasks/add", isAuth, addTask);
userRouter.get("/tasks", isAuth, getTasks);
userRouter.post("/tasks/delete", isAuth, deleteTask);
userRouter.post("/notes/add", isAuth, addNote);
userRouter.get("/notes", isAuth, getNotes);
userRouter.post("/notes/delete", isAuth, deleteNote);

// Reminder routes
userRouter.post("/reminders/add", isAuth, addReminder);
userRouter.get("/reminders", isAuth, getReminders);
userRouter.post("/reminders/delete", isAuth, deleteReminder);

// Teacher routes
userRouter.get("/teachers", isAuth, getTeachers);
userRouter.post("/teachers/lesson/start", isAuth, startTeacherLesson);
userRouter.post("/teachers/lesson/submit", isAuth, submitLessonAnswers);
userRouter.get("/teachers/progress", isAuth, getTeacherProgress);
userRouter.post("/teachers/ask", isAuth, askTeacher);

// Teacher roadmap routes
userRouter.get("/teachers/:teacherId/roadmap", isAuth, getTeacherRoadmap);
userRouter.post("/teachers/roadmap/lesson/start", isAuth, startRoadmapLesson);
userRouter.post("/teachers/roadmap/lesson/complete", isAuth, completeRoadmapLesson);

// Customization route
userRouter.post("/customization", isAuth, saveCustomization);

export default userRouter;
