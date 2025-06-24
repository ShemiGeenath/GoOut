const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration for guide images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/guides/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Create new guide
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { 
      name,
      bio,
      specialties,
      languages,
      experience,
      rate,
      contactPhone,
      contactEmail,
      userId,
      destinations
    } = req.body;

    // Validate required fields
    if (!name || !bio || !experience || !rate || !contactPhone || !userId || !destinations) {
      // Clean up uploaded files if validation fails
      if (req.files?.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(400).json({
        error: 'Missing required fields',
        requiredFields: {
          name: !name ? 'Name is required' : undefined,
          bio: !bio ? 'Bio is required' : undefined,
          experience: !experience ? 'Experience is required' : undefined,
          rate: !rate ? 'Rate is required' : undefined,
          contactPhone: !contactPhone ? 'Contact phone is required' : undefined,
          userId: !userId ? 'User ID is required' : undefined,
          destinations: !destinations ? 'At least one destination is required' : undefined
        }
      });
    }

    // Create new guide
    const newGuide = new Guide({
      name,
      bio,
      specialties: JSON.parse(specialties),
      languages: JSON.parse(languages),
      experience: parseInt(experience),
      rate: parseFloat(rate),
      contactPhone,
      contactEmail: contactEmail || null,
      userId,
      destinations: JSON.parse(destinations),
      images: req.files?.map(file => file.path) || []
    });

    const savedGuide = await newGuide.save();

    res.status(201).json({
      message: 'Guide created successfully',
      guide: {
        id: savedGuide._id,
        name: savedGuide.name,
        rate: savedGuide.rate,
        specialties: savedGuide.specialties,
        destinations: savedGuide.destinations,
        imageCount: savedGuide.images.length,
        createdAt: savedGuide.createdAt
      }
    });

  } catch (err) {
    console.error('[❌ Guide creation error]', err);
    
    // Clean up files if error occurs
    if (req.files?.length > 0) {
      req.files.forEach(file => fs.unlinkSync(file.path));
    }

    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

// Get all guides with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12,
      search,
      specialty,
      language,
      minRate,
      maxRate
    } = req.query;

    const skip = (page - 1) * limit;
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Specialty filter
    if (specialty) {
      query.specialties = specialty;
    }

    // Language filter
    if (language) {
      query.languages = language;
    }

    // Rate range filter
    if (minRate || maxRate) {
      query.rate = {};
      if (minRate) query.rate.$gte = parseFloat(minRate);
      if (maxRate) query.rate.$lte = parseFloat(maxRate);
    }

    const guides = await Guide.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalGuides = await Guide.countDocuments(query);

    res.json({
      guides,
      pagination: {
        totalGuides,
        totalPages: Math.ceil(totalGuides / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('[❌ Fetch guides error]', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

// Get guides by user
router.get('/user/:userId', async (req, res) => {
  try {
    const guides = await Guide.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(guides);
  } catch (err) {
    console.error('[❌ Fetch user guides error]', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

// Delete guide
router.delete('/:id', async (req, res) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    // Delete associated images
    if (guide.images?.length > 0) {
      guide.images.forEach(imagePath => {
        fs.unlink(imagePath, err => {
          if (err) console.error('Error deleting image:', err);
        });
      });
    }

    res.json({ message: 'Guide deleted successfully' });
  } catch (err) {
    console.error('[❌ Delete guide error]', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

module.exports = router;