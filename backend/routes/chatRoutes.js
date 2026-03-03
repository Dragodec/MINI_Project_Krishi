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

// Existing routes
router.post('/send', protect, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), chatController.sendMessage);

router.get('/history', protect, chatController.getHistory);

// Specific chat management routes
router.get('/:chatId', protect, chatController.getConversation);
router.delete('/:chatId', protect, chatController.deleteConversation);
router.put('/:chatId/rename', protect, chatController.renameConversation);

module.exports = router;