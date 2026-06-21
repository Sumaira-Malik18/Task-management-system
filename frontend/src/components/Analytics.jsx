import { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Analytics({ onClose }) {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [overviewRes, trendsRes] = await Promise.all([
        axios.get('http://localhost:5000/analytics/overview', { headers }),
        axios.get('http://localhost:5000/analytics/trends', { headers })
      ]);

      setOverview(overviewRes.data);
      setTrends(trendsRes.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg">Loading analytics...</div>
    </div>
  );

  const pieData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      data: [overview?.pending, overview?.inProgress, overview?.completed],
      backgroundColor: ['#FCD34D', '#60A5FA', '#34D399'],
      borderWidth: 1
    }]
  };

  const barData = {
    labels: trends.map(t => `Week ${t._id.week} - ${t._id.status}`),
    datasets: [{
      label: 'Tasks',
      data: trends.map(t => t.count),
      backgroundColor: trends.map(t =>
        t._id.status === 'Completed' ? '#34D399' :
        t._id.status === 'In Progress' ? '#60A5FA' : '#FCD34D'
      )
    }]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📊 Analytics Dashboard</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-xl">✕</button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-blue-600">{overview?.total}</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-green-600">{overview?.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-yellow-600">{overview?.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-red-600">{overview?.overdue}</p>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Status Breakdown</h3>
            <Pie data={pieData} />
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Weekly Trends</h3>
            <Bar data={barData} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;