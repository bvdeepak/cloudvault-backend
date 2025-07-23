// cloudvault-backend/controllers/fileController.js
const File = require('../models/File');
const path = require('path');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
  try {
    const file = await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      user: req.user.id,
    });
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user.id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '../uploads', file.filename);
    res.download(filePath, file.originalname);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '../uploads', file.filename);
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
