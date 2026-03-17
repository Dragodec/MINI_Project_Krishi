require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const chatRoutes = require('./routes/chatRoutes');
const soilRoutes = require('./routes/soilRoutes'); // New Integration
const usageRoutes = require('./routes/dev/usageRoutes');

const { protect } = require('./middleware/authMiddleware');
const corsOptions = require('./config/corsOptions');

const app = express();

// --- 🛡️ RATE LIMITING CONFIGURATION ---
// Restored: Prevents Gemini API abuse and brute force
const chatLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, 
  max: (process.env.RATE_LIMIT_MAX || 15), 
  message: { error: "Too many queries. Please wait 15 minutes before asking again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- ⚙️ MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// --- 📂 FILE SYSTEM & STATIC SERVING ---
// Restored: Ensures folders exist so Multer doesn't throw errors
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dirs = ['./uploads/images', './uploads/audio'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// --- 🗄️ DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crop_db')
  .then(() => console.log(`🚀 Connected to MongoDB: ${mongoose.connection.name}`))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// --- 🛣️ ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/weather', protect, weatherRoutes);

// Apply Chat Limiter specifically to the sending route
app.use('/api/chat/send', chatLimiter); 
app.use('/api/chat', chatRoutes);

// New Integration: Soil Simulation & Plot Management
app.use('/api/soil', protect, soilRoutes); 

app.use('/api/usage', protect, usageRoutes);

// --- ⚠️ GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});