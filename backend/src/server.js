import express from "express";
import notesroutes from "./routes/notesroutes.js";
import cors from "cors"

import dotenv from "dotenv"

import { connectDB } from "./config/db.js";
import ratelimiter from "./middlewere/ratelimiter.js";


dotenv.config()

const app = express();

app.use(cors({origin:"http://localhost:5173"}))

// parse JSON bodies (so req.body works on POST/PUT)
app.use(express.json());






app.use((req, res, next) => {
  console.log(`req method is ${req.method} and url is ${req.url}`);
  next(); // VERY IMPORTANT
});

app.use(ratelimiter)
// Register routes before listening
app.use("/api/notes", notesroutes);



const PORT = 5001;
connectDB();
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

//UPSTASH_REDIS_REST_URL="https://amazed-gazelle-6589.upstash.io"
