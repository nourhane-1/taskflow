const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getTasks, createTask, getTask, updateTask,
  updateStatus, assignTask, addComment, deleteTask, moveTask
} = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateStatus);
router.patch('/:id/assign', assignTask);
router.patch('/:id/move', moveTask);
router.post('/:id/comments', addComment);
router.delete('/:id', deleteTask);

module.exports = router;