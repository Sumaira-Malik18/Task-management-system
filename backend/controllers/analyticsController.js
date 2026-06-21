const Task = require('../models/Task');
const mongoose = require('mongoose');

// GET /analytics/overview
exports.getOverview = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const total = await Task.countDocuments({
      $or: [{ owner: userId }, { sharedWith: userId }]
    });

    const completed = await Task.countDocuments({
      $or: [{ owner: userId }, { sharedWith: userId }],
      status: 'Completed'
    });

    const pending = await Task.countDocuments({
      $or: [{ owner: userId }, { sharedWith: userId }],
      status: 'Pending'
    });

    const inProgress = await Task.countDocuments({
      $or: [{ owner: userId }, { sharedWith: userId }],
      status: 'In Progress'
    });

    const overdue = await Task.countDocuments({
      $or: [{ owner: userId }, { sharedWith: userId }],
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' }
    });

    res.json({ total, completed, pending, inProgress, overdue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /analytics/trends
exports.getTrends = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const trends = await Task.aggregate([
      {
        $match: {
          $or: [{ owner: userId }, { sharedWith: userId }]
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$createdAt' },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.week': 1 } }
    ]);

    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};