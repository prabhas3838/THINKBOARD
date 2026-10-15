import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import ratelimiter from "./middlewere/ratelimiter.js";
import authroutes from "./routes/authroutes.js";
import notesroutes from "./routes/notesroutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl/mobile) or localhost/Vercel
      if (!origin) return callback(null, true);
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.endsWith(".vercel.app") ||
        (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);


// Parse JSON bodies
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rate limiter middleware
app.use(ratelimiter);

// Routes
app.use("/api/auth", authroutes);
app.use("/api/notes", notesroutes);

// Root healthcheck
app.get("/", (req, res) => {
  res.json({ message: "THINKBOARD API is running" });
});

const PORT = process.env.PORT || 5001;
connectDB();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
