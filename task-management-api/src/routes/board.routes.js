const express = require('express');
const router = express.Router();
const {
  getBoards, createBoard, getBoard,
  updateBoard, deleteBoard, addMember,
  removeMember, getMembers
} = require('../controllers/board.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', getBoards);
router.post('/', createBoard);
router.get('/:id', getBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);
router.get('/:id/members', getMembers);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;