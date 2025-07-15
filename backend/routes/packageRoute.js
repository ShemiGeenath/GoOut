const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/packages';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const data = req.body;
    const newPackage = new Package({
      ...data,
      price: parseFloat(data.price),
      departureDates: JSON.parse(data.departureDates),
      included: JSON.parse(data.included),
      activities: JSON.parse(data.activities),
      images: req.files.map(file => file.path)
    });
    const saved = await newPackage.save();
    res.status(201).json({ message: 'Package saved', id: saved._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Save failed', details: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const allPackages = await Package.find().sort({ createdAt: -1 });
    res.json(allPackages);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

module.exports = router;
