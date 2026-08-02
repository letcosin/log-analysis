import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.log') || file.originalname.endsWith('.txt')) {
      cb(null, true);
      return;
    }

    cb(new Error('Only .log and .txt files are allowed'));
  },
});
