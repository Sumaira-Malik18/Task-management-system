const router = require('express').Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');

const { body, validationResult } = require('express-validator');
const validate = [
  body('title').notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['Pending','In Progress','Completed']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];
router.post('/', validate, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;