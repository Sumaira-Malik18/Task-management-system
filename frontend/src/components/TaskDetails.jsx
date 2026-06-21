import { useState } from 'react';
import { shareTask } from '../services/api';

function TaskDetails({ task, onEdit, onClose }) {
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [shareError, setShareError] = useState('');

  if (!task) return null;

  const handleShare = async () => {
    try {
      setShareError('');
      setShareMessage('');
      await shareTask(task._id, { email: shareEmail });
      setShareMessage(`Task shared successfully!`);
      setShareEmail('');
    } catch (err) {
      setShareError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Task Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 font-bold text-lg"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <span className="text-xs text-gray-400 uppercase">Title</span>
          <p className="font-bold text-gray-800 dark:text-white">{task.title}</p>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase">Description</span>
          <p className="text-gray-600 dark:text-gray-300">{task.description || 'No description'}</p>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase">Status</span>
          <p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              task.status === 'Completed' ? 'bg-green-100 text-green-700' :
              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>{task.status}</span>
          </p>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase">Due Date</span>
          <p className="text-gray-600 dark:text-gray-300">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
          </p>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase">Created At</span>
          <p className="text-gray-600 dark:text-gray-300">
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* SHARE TASK SECTION */}
        <div className="border-t dark:border-gray-700 pt-3 mt-2">
          <span className="text-xs text-gray-400 uppercase">Share Task</span>
          <div className="flex gap-2 mt-2">
            <input
              type="email"
              placeholder="Enter email to share"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded p-2 text-sm outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <button
              onClick={handleShare}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-600"
            >
              Share
            </button>
          </div>
          {shareMessage && <p className="text-green-600 text-xs mt-1">{shareMessage}</p>}
          {shareError && <p className="text-red-500 text-xs mt-1">{shareError}</p>}
        </div>

        <button
          onClick={() => onEdit(task)}
          className="bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 mt-2"
        >
          Edit Task
        </button>
      </div>
    </div>
  );
}

export default TaskDetails;