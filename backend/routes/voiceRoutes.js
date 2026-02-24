const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const voiceController = require('../controllers/voiceController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/audio/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/process', protect, upload.single('audio'), voiceController.handleVoiceQuery);
router.get('/history', protect, voiceController.getQueryHistory);

module.exports = router;