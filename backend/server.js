const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// 🔴 COMMENT THESE TEMPORARILY
 const authRoute = require('./routes/authRoute');
 const itemRoutes = require('./routes/itemRoutes');
const guideRoutes = require('./routes/guideRoutes');
const hotelRoutes = require('./routes/hotelRoute');

// 🔴 ONLY USE ONE ROUTE FOR TESTING
 app.use('/api/auth', authRoute);
 app.use('/api/items', itemRoutes);
app.use('/api/guides', guideRoutes); // 🚨 THIS is what we'll test
app.use('/api/hotels', hotelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
