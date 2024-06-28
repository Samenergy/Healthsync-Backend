import express from 'express';
import dotenv from 'dotenv';
import sequelize from './configs/database.js';
import adminRoutes from './routes/adminRoutes.js';
import cors from "cors";

// Load environment variables
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: ["Authorization", "Content-Type"],
};

// Sync models
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/admin', adminRoutes);
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
