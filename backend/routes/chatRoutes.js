const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') cb(null, 'uploads/images/');
        else cb(null, 'uploads/audio/');
    },
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/send', protect, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), chatController.sendMessage);

router.get('/', protect, chatController.getConversation);
router.get('/history', protect, chatController.getHistory); // Fixed

module.exports = router;