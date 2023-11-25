const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const tasks = []; // In-memory storage for tasks

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const newTask = req.body;
  newTask.id = tasks.length + 1;
  tasks.push(newTask);
  res.json(newTask);
});

// Update a task
app.put('/api/tasks/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const updatedTask = req.body;

  // Find the task by ID
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    // Update the task
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Delete a task
app.delete('/api/tasks/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);

  // Filter out the task with the specified ID
  const updatedTasks = tasks.filter(task => task.id !== taskId);

  if (updatedTasks.length < tasks.length) {
    tasks.length = 0; // Clear the existing tasks array
    tasks.push(...updatedTasks); // Add the updated tasks back
    res.status(204).send(); // No content - successful deletion
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Task Scheduler backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
