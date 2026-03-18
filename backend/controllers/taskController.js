const Task = require('../models/Task');
const axios = require('axios');
const FormData = require('form-data');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.generateTasks = async (req, res) => {
    try {
        const { crop, plantingDate } = req.body;
        
        if (!crop || !plantingDate) {
             return res.status(400).json({ error: "Crop and plantingDate are required" });
        }

        const form = new FormData();
        form.append('crop', crop);
        form.append('plantingDate', plantingDate);

        // Call Python AI Simulation Service
        const aiResponse = await axios.post('http://127.0.0.1:8000/generate-tasks', form, {
            headers: form.getHeaders()
        });

        if (aiResponse.data.error) {
            return res.status(500).json({ error: aiResponse.data.error });
        }

        const generatedTasks = aiResponse.data.tasks;
        const plantingDateObj = new Date(plantingDate);

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
        console.error("Task generation error:", err.message);
        res.status(500).json({ error: err.message || "Failed to generate tasks" });
    }
};

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

exports.deleteTask = async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
