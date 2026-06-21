const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      owner: req.userId
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { search, status } = req.query;
    const mongoose = require('mongoose');
    const userId = new mongoose.Types.ObjectId(req.userId);

    let filter = {
      $or: [
        { owner: userId },
        { sharedWith: userId }
      ]
    };

    if (search) {
      filter.$and = [
        { $or: filter.$or },
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete filter.$or;
    }

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.shareTask = async (req, res) => {
  try {
    const { email } = req.body;
    const User = require('../models/User');
    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ error: 'User not found' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.sharedWith.includes(userToShare._id)) {
      return res.status(400).json({ error: 'Task already shared with this user' });
    }
    task.sharedWith.push(userToShare._id);
    await task.save();
    const io = req.app.get('io');
    io.to(userToShare._id.toString()).emit('notification', {
      message: `A task "${task.title}" has been shared with you!`,
      taskId: task._id,
      type: 'task_shared'
    });
    res.json({ message: `Task shared with ${userToShare.name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSharedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      sharedWith: req.userId
    }).populate('owner', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};