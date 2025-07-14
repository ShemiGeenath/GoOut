const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📸 Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/guides';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  }
});

// ✅ POST: Create new guide
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const {
      name, bio, specialties, languages,
      experience, rate, contactPhone, contactEmail,
      userId, destinations
    } = req.body;

    if (!name || !bio || !experience || !rate || !contactPhone || !userId || !destinations) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newGuide = new Guide({
      name,
      bio,
      specialties: JSON.parse(specialties || '[]'),
      languages: JSON.parse(languages || '[]'),
      experience: parseInt(experience),
      rate: parseFloat(rate),
      contactPhone,
      contactEmail: contactEmail || '',
      userId,
      destinations: JSON.parse(destinations || '[]'),
      images: req.files.map(f => f.path)
    });

    const saved = await newGuide.save();

    res.status(201).json({
      message: 'Guide created',
      guide: saved
    });

  } catch (err) {
    console.error('[❌ Guide Submit Error]', err);
    req.files?.forEach(f => fs.unlinkSync(f.path));
    res.status(500).json({ error: 'Guide creation failed', details: err.message });
  }
});

// ✅ GET guides by user
router.get('/user/:userId', async (req, res) => {
  try {
    const guides = await Guide.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user guides' });
  }
});

module.exports = router;
