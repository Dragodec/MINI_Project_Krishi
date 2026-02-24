require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const reportRoutes = require('./routes/reportRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const authRoutes = require('./routes/authRoutes'); // Added
const { protect } = require('./middleware/authMiddleware'); // Added

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const dirs = ['./uploads/images', './uploads/audio'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crop_db')
 .then(() => console.log(`Connected to ${process.env.MONGO_URI || 'MongoDB'}`))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes); // Auth is public
app.use('/api/reports', protect, reportRoutes); // Protected
app.use('/api/voice', protect, voiceRoutes);   // Protected

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));