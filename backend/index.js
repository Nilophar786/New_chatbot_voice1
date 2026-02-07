import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import weatherRouter from "./routes/weather.routes.js";
import autonomousRouter from "./routes/autonomous.routes.js";
import multilingualRouter from "./routes/multilingual.routes.js";
import User from "./models/user.model.js";
import nodemailer from "nodemailer";
import { generalLimiter, authLimiter, apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// ✅ 1. CORS — MUST BE FIRST, before cookieParser and routes
app.use(cors({
  origin: ["https://new-chatbot-voice1-frontend.onrender.com", "http://localhost:5173"], // allow both production and localhost
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
}));

// ✅ 2. Body parser
app.use(express.json());

// ✅ 3. Cookie parser
app.use(cookieParser());

// ✅ 4. Rate limiting
app.use(generalLimiter);
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// ✅ 5. Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/autonomous", autonomousRouter);
app.use("/api/multilingual", multilingualRouter);

// ✅ 6. Nodemailer setup (optional)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  console.log('Email credentials not configured.');
}

// ✅ 7. Reminder scheduler
const checkReminders = async () => {
  try {
    const now = new Date();
    const users = await User.find({ 'reminders.active': true });

    for (const user of users) {
      const dueReminders = user.reminders.filter(reminder =>
        reminder.active && reminder.time <= now
      );

      for (const reminder of dueReminders) {
        console.log(`Reminder triggered for user ${user.name}: ${reminder.message}`);

        if (transporter) {
          try {
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: 'Reminder Notification',
              text: `Reminder: ${reminder.message}\n\nAutomated reminder from your voice assistant.`
            });
            console.log(`Email sent to ${user.email}`);
          } catch (emailError) {
            console.error('Error sending email:', emailError);
          }
        }

        reminder.active = false;
      }

      if (dueReminders.length > 0) {
        await user.save();
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};
setInterval(checkReminders, 60 * 1000);

// ✅ 8. Server start
const port = process.env.PORT || 8000;
app.listen(port, () => {
  connectDb();
  console.log("Server started on port", port);
  console.log("Reminder scheduler started");
});
