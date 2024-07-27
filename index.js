import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath from 'url'
import userRoutes from "./routes/userRoutes.js";
import sequelize from "./config/database.js";
import authRoutes from "./routes/AuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import queueRoutes from "./routes/queue.js";

dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: ["Authorization", "Content-Type"],
};

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses incoming URL-encoded data

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/queue", queueRoutes);
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start the server
(async () => {
  try {
    // Sync database
    await sequelize.sync();
    console.log("Database synced successfully.");

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();
