const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration for destination images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/destinations/';
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

// Create new destination
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { 
      name,
      description,
      type,
      location,
      bestTimeToVisit,
      activities,
      tips,
      highlights,
      userId
    } = req.body;

    // Validate required fields
    if (!name || !description || !type || !location || !bestTimeToVisit || !activities || !userId) {
      // Clean up uploaded files if validation fails
      if (req.files?.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(400).json({
        error: 'Missing required fields',
        requiredFields: {
          name: !name ? 'Name is required' : undefined,
          description: !description ? 'Description is required' : undefined,
          type: !type ? 'Type is required' : undefined,
          location: !location ? 'Location is required' : undefined,
          bestTimeToVisit: !bestTimeToVisit ? 'Best time to visit is required' : undefined,
          activities: !activities ? 'At least one activity is required' : undefined,
          userId: !userId ? 'User ID is required' : undefined
        }
      });
    }

    // Create new destination
    const newDestination = new Destination({
      name,
      description,
      type,
      location,
      bestTimeToVisit: JSON.parse(bestTimeToVisit),
      activities: JSON.parse(activities),
      tips: tips || null,
      highlights: highlights || null,
      userId,
      images: req.files?.map(file => file.path) || []
    });

    const savedDestination = await newDestination.save();

    res.status(201).json({
      message: 'Destination created successfully',
      destination: {
        id: savedDestination._id,
        name: savedDestination.name,
        type: savedDestination.type,
        location: savedDestination.location,
        imageCount: savedDestination.images.length,
        createdAt: savedDestination.createdAt
      }
    });

  } catch (err) {
    console.error('[❌ Destination creation error]', err);
    
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

// Get all destinations with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12,
      search,
      type,
      activity,
      season
    } = req.query;

    const skip = (page - 1) * limit;
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Activity filter
    if (activity) {
      query.activities = activity;
    }

    // Season filter
    if (season) {
      query.bestTimeToVisit = season;
    }

    const destinations = await Destination.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalDestinations = await Destination.countDocuments(query);

    res.json({
      destinations,
      pagination: {
        totalDestinations,
        totalPages: Math.ceil(totalDestinations / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('[❌ Fetch destinations error]', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

// Get destinations by user
router.get('/user/:userId', async (req, res) => {
  try {
    const destinations = await Destination.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    console.error('[❌ Fetch user destinations error]', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

// Delete destination
router.delete('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Delete associated images
    if (destination.images?.length > 0) {
      destination.images.forEach(imagePath => {
        fs.unlink(imagePath, err => {
          if (err) console.error('Error deleting image:', err);
        });
      });
    }

    res.json({ message: 'Destination deleted successfully' });
  } catch (err) {
    console.error('[❌ Delete destination error]', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

module.exports = router;