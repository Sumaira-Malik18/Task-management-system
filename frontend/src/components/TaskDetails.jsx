function TaskDetails({ task, onEdit, onClose }) {
  if (!task) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Task Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 font-bold text-lg"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <span className="text-xs text-gray-400 uppercase">Title</span>
          <p className="font-bold text-gray-800">{task.title}</p>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase">Description</span>
          <p className="text-gray-600">{task.description || 'No description'}</p>
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
          <p className="text-gray-600">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
          </p>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase">Created At</span>
          <p className="text-gray-600">
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
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