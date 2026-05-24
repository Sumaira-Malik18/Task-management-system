import { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';

function App() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const handleSuccess = () => {
    setEditTask(null);
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-2xl font-bold">📋 Task Manager</h1>
      </nav>

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