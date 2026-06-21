import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import Login from './components/Login';
import Analytics from './components/Analytics';

const socket = io('http://localhost:5000');

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (user) {
      socket.emit('join', user.id);
      socket.on('notification', (data) => {
        setNotifications(prev => [data, ...prev]);
      });
    }
    return () => {
      socket.off('notification');
    };
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleSuccess = () => {
    setEditTask(null);
    setRefresh(prev => prev + 1);
  };

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const total = tasks.length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white p-4 shadow flex justify-between items-center">
        <h1 className="text-2xl font-bold">📋 Task Manager</h1>
        <div className="flex items-center gap-4">

          {/* ANALYTICS BUTTON */}
          <button
            onClick={() => setShowAnalytics(true)}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-bold hover:bg-gray-100"
          >
            📊 Analytics
          </button>

          {/* NOTIFICATIONS BELL */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-white text-blue-600 px-3 py-1 rounded text-sm font-bold hover:bg-gray-100"
            >
              🔔 {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* NOTIFICATIONS DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50">
                <div className="p-3 border-b flex justify-between items-center">
                  <span className="font-bold text-gray-800">Notifications</span>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs text-red-500"
                  >
                    Clear all
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif, index) => (
                    <div key={index} className="p-3 border-b text-sm text-gray-700 hover:bg-gray-50">
                      {notif.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <span className="text-sm">👋 {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-bold hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
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

      {/* ANALYTICS MODAL */}
      {showAnalytics && (
        <Analytics onClose={() => setShowAnalytics(false)} />
      )}

    </div>
  );
}

export default App;