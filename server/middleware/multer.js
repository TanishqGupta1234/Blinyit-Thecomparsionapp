import multer from 'multer';

// Storage: Store the uploaded files in memory as Buffer objects
const storage = multer.memoryStorage();

// File filter: Accept images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed!'));
  }
};

// Initialize upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

export default upload;
