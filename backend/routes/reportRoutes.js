const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/images/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/analyze', protect, upload.single('image'), reportController.analyzeCrop);
router.get('/', protect, reportController.getReports);

module.exports = router;