import multer from 'multer';
import path from 'path';

// Define storage location and filename format
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    // Extract file extension
    const ext = path.extname(file.originalname);
    // Generate a unique filename with the correct extension
    cb(null, `${Date.now()}${ext}`);
  },
});

// Create multer instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload;
