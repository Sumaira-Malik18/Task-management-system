import { useState, useEffect } from 'react';
import { getTasks, deleteTask } from '../services/api';

function TaskList({ onEdit, onSelect, onTasksLoaded }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter]);

  const fetchTasks = async () => {
    try {
      const res = await getTasks({ search, status: statusFilter });
      setTasks(res.data);
      onTasksLoaded(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="flex flex-col gap-3">
      
      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded p-2 outline-none focus:border-blue-500"
      />

      {/* FILTER BUTTONS */}
      <div className="flex gap-2">
        {['', 'Pending', 'In Progress', 'Completed'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              statusFilter === s
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {s === '' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No tasks found!
        </div>
      ) : (
        tasks.map(task => (
          <div key={task._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">{task.title}</h3>
              <p className="text-sm text-gray-500">{task.description}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{task.status}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onSelect(task)} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">View</button>
              <button onClick={() => onEdit(task)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
              <button onClick={() => handleDelete(task._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;