// cloudvault-backend/routes/fileRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../models/File'); // ✅ relative path must be correct

const {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile
} = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/', authMiddleware, getFiles);
router.get('/download/:id', authMiddleware, downloadFile);
router.delete('/:id', authMiddleware, deleteFile);

router.get('/files/shared/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
