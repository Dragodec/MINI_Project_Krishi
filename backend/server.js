require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Added
const fs = require('fs');
const path = require('path');

const reportRoutes = require('./routes/reportRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const { protect } = require('./middleware/authMiddleware');
const corsOptions = require('./config/corsOptions');

const app = express();

app.use(express.json());
app.use(cookieParser()); // Added: Critical for reading cookies
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dirs = ['./uploads/images', './uploads/audio'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crop_db')
  .then(() => console.log(`🚀 Connected to MongoDB: ${mongoose.connection.name}`))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/reports', protect, reportRoutes);
app.use('/api/voice', protect, voiceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/weather', protect, weatherRoutes);

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