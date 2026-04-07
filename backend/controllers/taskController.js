const Task = require('../models/Task');
const axios = require('axios');
const FormData = require('form-data');

// @desc    Get all tasks for current user
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Generate AI-driven context-aware tasks
// @route   POST /api/tasks/generate
exports.generateTasks = async (req, res) => {
    try {
        const { crop, plantingDate, environment } = req.body;

        if (!crop || !plantingDate) {
            return res.status(400).json({ error: "Crop and plantingDate are required" });
        }

        // 1. CLEAR OLD PLAN: Ensure a fresh cycle
        await Task.deleteMany({ userId: req.user._id });

        // 2. PREPARE PAYLOAD FOR FASTAPI
        const form = new FormData();
        form.append('crop', crop);
        form.append('plantingDate', plantingDate);
        
        // Forward simulation context to AI
        form.append('soilType', environment?.soilType || "laterite");
        form.append('moisture', (environment?.moisture || 50).toString());
        form.append('weather', environment?.weather || "clear");

        // 3. CALL PYTHON AI SERVICE
        const aiResponse = await axios.post('http://127.0.0.1:8000/generate-tasks', form, {
            headers: form.getHeaders()
        });

        if (aiResponse.data.error) {
            return res.status(500).json({ error: aiResponse.data.error });
        }

        const generatedTasks = aiResponse.data.tasks;
        const plantingDateObj = new Date(plantingDate);

        // 4. TRANSFORM & SAVE
        const tasksToSave = generatedTasks.map(t => {
            const dueDate = new Date(plantingDateObj);
            dueDate.setDate(dueDate.getDate() + t.daysFromPlanting);
            
            return {
                userId: req.user._id,
                crop: crop,
                title: t.title,
                description: t.description,
                dueDate: dueDate,
                completed: false
            };
        });

        const savedTasks = await Task.insertMany(tasksToSave);
        res.status(201).json(savedTasks);
    } catch (err) {
        console.error("AI Planner Link Error:", err.message);
        res.status(500).json({ error: "Failed to sync with AI Planning Engine" });
    }
};

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/toggle
exports.toggleTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        
        task.completed = !task.completed;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Delete a specific task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!result) return res.status(404).json({ error: "Task not found" });
        res.json({ message: 'Task removed from timeline' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};