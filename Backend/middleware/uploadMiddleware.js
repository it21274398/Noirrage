import multer from "multer";

// Set a limit for file size (e.g., 5MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB limit
});

export default upload;
