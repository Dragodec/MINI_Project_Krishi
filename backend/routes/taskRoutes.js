const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task operations require a verified session
router.use(protect);

router.get('/', taskController.getTasks);
router.post('/generate', taskController.generateTasks);
router.patch('/:id/toggle', taskController.toggleTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;