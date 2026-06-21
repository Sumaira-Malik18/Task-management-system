import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/api';

function TaskForm({ task, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await updateTask(task._id, formData);
      } else {
        await createTask(formData);
      }
      onSuccess();
      setFormData({ title: '', description: '', status: 'Pending', dueDate: '' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        {task ? 'Edit Task' : 'Add New Task'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded p-2 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          required
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded p-2 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          rows="3"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded p-2 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded p-2 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600"
        >
          {task ? 'Update Task' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;