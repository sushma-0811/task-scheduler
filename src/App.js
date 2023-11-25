import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    dueDate: '',
    priority: 'Low',
  });

  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    // Send a request to the backend to create a new task
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(response => response.json())
      .then(data => {
        // Update the state with the new task
        setTasks(prevTasks => [...prevTasks, data]);
        // Clear the form
        setNewTask({
          name: '',
          dueDate: '',
          priority: 'Low',
        });
      })
      .catch(error => console.error('Error creating task:', error));
  };

  const handleTaskUpdate = (taskId, updatedTask) => {
    // Send a request to the backend to update the task
    fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then(response => response.json())
      .then(data => {
        // Update the state with the updated task
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === taskId ? data : task))
        );
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const handleTaskDelete = (taskId) => {
    // Send a request to the backend to delete the task
    fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update the state by removing the deleted task
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div className="App">
      <h1>Task Scheduler</h1>

      {/* Task Creation Form */}
      <form onSubmit={handleTaskSubmit}>
        <label>
          Task Name:
          <input type="text" name="name" value={newTask.name} onChange={handleInputChange} />
        </label>
        <label>
          Due Date:
          <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleInputChange} />
        </label>
        <label>
          Priority:
          <select name="priority" value={newTask.priority} onChange={handleInputChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <div>
              <strong>{task.name}</strong> - Due: {task.dueDate} - Priority: {task.priority}
            </div>
            <div>
              <button onClick={() => handleTaskUpdate(task.id, { ...task, name: 'Updated Task' })}>
                Update
              </button>
              <button onClick={() => handleTaskDelete(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
