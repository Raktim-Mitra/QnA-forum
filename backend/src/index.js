// backend/index.js

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import questionrouter from "./routes/questionRoutes.js";
import answerrouter from "./routes/answerRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import authRouter from "./routes/authRoutes.js";


dotenv.config();

// Initialize app

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // <-- this must be true
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));



// Mount routes
app.use("/api/questions", questionrouter);
app.use("/api/answers", answerrouter);
app.use("/api/comments", commentRouter);
app.use("/api/auth",authRouter)

// Root test route
app.get("/", (req, res) => {
  res.send("🎉 QnA Forum API is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
