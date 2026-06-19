import { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';

function App() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [tasks, setTasks] = useState([]);

  const handleSuccess = () => {
    setEditTask(null);
    setRefresh(prev => prev + 1);
  };

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const total = tasks.length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-2xl font-bold">📋 Task Manager</h1>
      </nav>

      {/* PROGRESS BAR */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="bg-white p-4 rounded-lg shadow mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-blue-600">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{completed} of {total} tasks completed</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6">

        {/* LEFT SIDE */}
        <div className="flex-1">
          <TaskForm
            task={editTask}
            onSuccess={handleSuccess}
          />
          <TaskList
            key={refresh}
            onEdit={(task) => setEditTask(task)}
            onSelect={(task) => setSelectedTask(task)}
            onTasksLoaded={(loadedTasks) => setTasks(loadedTasks)}
          />
        </div>

        {/* RIGHT SIDE - Task Details */}
        {selectedTask && (
          <div className="w-full md:w-80">
            <TaskDetails
              task={selectedTask}
              onEdit={(task) => {
                setEditTask(task);
                setSelectedTask(null);
              }}
              onClose={() => setSelectedTask(null)}
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;