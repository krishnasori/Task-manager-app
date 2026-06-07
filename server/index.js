const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// The process.env.PORT is crucial for deployment later!
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

// Set up the path to our JSON database file
const dataFile = path.join(__dirname, 'tasks.json');

// Helper function: Read tasks from the JSON file
const readTasks = () => {
    if (!fs.existsSync(dataFile)) {
        return []; // Return empty array if file doesn't exist yet
    }
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
};

// Helper function: Write tasks to the JSON file
const writeTasks = (tasks) => {
    fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
};

// 1. GET: Fetch all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    const sortedTasks = tasks.sort((a, b) => b.createdAt - a.createdAt);
    res.json(sortedTasks);
});

// 2. POST: Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, dueDate } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const tasks = readTasks();
    const newTask = {
        id: Date.now().toString(),
        title,
        description: description || '',
        dueDate: dueDate || null,
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(newTask);
    writeTasks(tasks); // Save to file
    res.status(201).json(newTask);
});

// 3. PUT: Update an existing task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title !== undefined ? title : tasks[taskIndex].title,
        description: description !== undefined ? description : tasks[taskIndex].description,
        dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed
    };

    writeTasks(tasks); // Save changes to file
    res.json(tasks[taskIndex]);
});

// 4. DELETE: Remove a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks); // Save changes to file
    res.json({ message: 'Task deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});