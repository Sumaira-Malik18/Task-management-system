const router = require('express').Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask, shareTask, getSharedTasks } = require('../controllers/taskController');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const validate = [
  body('title').notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

router.post('/', auth, validate, createTask);
router.get('/', auth, getTasks);
router.get('/shared', auth, getSharedTasks);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, updateTask);
router.put('/:id/share', auth, shareTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;