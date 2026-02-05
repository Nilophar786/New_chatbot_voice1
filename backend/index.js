import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import weatherRouter from "./routes/weather.routes.js"
import autonomousRouter from "./routes/autonomous.routes.js"
import multilingualRouter from "./routes/multilingual.routes.js"
import geminiResponse from "./gemini.js"
import User from "./models/user.model.js"
import nodemailer from "nodemailer"
import { generalLimiter, authLimiter, apiLimiter } from "./middlewares/rateLimiter.js"


const app=express()
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
           
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Temporarily allow all origins for debugging
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}))
const port=process.env.PORT || 8000
app.use(express.json())
app.use(cookieParser())

// Apply rate limiting
app.use(generalLimiter) // General rate limiter for all routes
app.use("/api/auth", authLimiter) // Stricter limiter for auth routes
app.use("/api", apiLimiter) // Limiter for API routes

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/weather",weatherRouter)
app.use("/api/autonomous",autonomousRouter)
app.use("/api/multilingual",multilingualRouter)

// Nodemailer setup (only if credentials are available)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail', // or 'hotmail', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  console.log('Email credentials not configured. Add EMAIL_USER and EMAIL_PASS to .env file for reminder notifications.');
}

// Reminder scheduler
const checkReminders = async () => {
  try {
    const now = new Date();
    const users = await User.find({ 'reminders.active': true });

    for (const user of users) {
      const dueReminders = user.reminders.filter(reminder =>
        reminder.active &&
        reminder.time <= now
      );

      for (const reminder of dueReminders) {
        console.log(`Reminder triggered for user ${user.name}: ${reminder.message}`);

        // Send email notification if configured
        if (transporter) {
          try {
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: 'Reminder Notification',
              text: `Reminder: ${reminder.message}\n\nThis is an automated reminder from your voice assistant.`
            });
            console.log(`Email sent to ${user.email} for reminder: ${reminder.message}`);
          } catch (emailError) {
            console.error('Error sending email:', emailError);
          }
        } else {
          console.log(`Reminder notification: ${reminder.message} (email not configured)`);
        }

        // Mark reminder as inactive
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

// Check reminders every minute
setInterval(checkReminders, 60 * 1000);

app.listen(port,()=>{
    connectDb()
    console.log("server started")
    console.log("Reminder scheduler started")
})

