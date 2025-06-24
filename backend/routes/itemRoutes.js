const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Enhanced Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
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

// Create new item with all fields
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { 
      title,
      description,
      category,
      price,
      rentalType,
      location,
      contactPhone,
      contactEmail,
      userId
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !price || !rentalType || !location || !contactPhone || !userId) {
      // Clean up uploaded files if validation fails
      if (req.files?.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(400).json({
        error: 'Missing required fields',
        requiredFields: {
          title: !title ? 'Title is required' : undefined,
          description: !description ? 'Description is required' : undefined,
          category: !category ? 'Category is required' : undefined,
          price: !price ? 'Price is required' : undefined,
          rentalType: !rentalType ? 'Rental type is required' : undefined,
          location: !location ? 'Location is required' : undefined,
          contactPhone: !contactPhone ? 'Contact phone is required' : undefined,
          userId: !userId ? 'User ID is required' : undefined
        }
      });
    }

    // Create new item
    const newItem = new Item({
      title,
      description,
      category,
      price: parseFloat(price),
      rentalType,
      location,
      contactPhone,
      contactEmail: contactEmail || null,
      userId,
      images: req.files?.map(file => file.path) || []
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      message: 'Item created successfully',
      item: {
        id: savedItem._id,
        title: savedItem.title,
        price: savedItem.price,
        category: savedItem.category,
        rentalType: savedItem.rentalType,
        imageCount: savedItem.images.length,
        createdAt: savedItem.createdAt
      }
    });

  } catch (err) {
    console.error('[❌ Item creation error]', err);
    
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

// Get items by user with all fields
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const items = await Item.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await Item.countDocuments({ userId: req.params.userId });

    res.json({    
      items,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('[❌ Fetch user items error]', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

// Get all items with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      rentalType
    } = req.query;

    const skip = (page - 1) * limit;
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Rental type filter
    if (rentalType) {
      query.rentalType = rentalType;
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('[❌ Fetch all items error]', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Delete associated images
    if (item.images?.length > 0) {
      item.images.forEach(imagePath => {
        fs.unlink(imagePath, err => {
          if (err) console.error('Error deleting image:', err);
        });
      });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('[❌ Delete item error]', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

module.exports = router;