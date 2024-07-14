import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'user_picture') {
      cb(null, path.join(__dirname, '../uploads/user'));
    } else if (file.fieldname === 'hospital_logo') {
      cb(null, path.join(__dirname, '../uploads/hospital'));
    } else {
      cb(new Error('Invalid field name'));
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

export default upload;
