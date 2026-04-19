const Board = require('../models/Board');
const User = require('../models/User');

exports.getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ owner: req.user.id });
    res.json(boards);
  } catch (error) {
    next(error);
  }
};

exports.createBoard = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const board = await Board.create({ title, description, owner: req.user.id });
    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

exports.getBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id).populate('members', '-password');
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (error) {
    next(error);
  }
};

exports.updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (error) {
    next(error);
  }
};

exports.deleteBoard = async (req, res, next) => {
  try {
    await Board.findByIdAndDelete(req.params.id);
    res.json({ message: 'Board deleted' });
  } catch (error) {
    next(error);
  }
};



exports.addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    if (board.members.includes(user._id)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    board.members.push(user._id);
    await board.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    board.members = board.members.filter(
      m => m.toString() !== req.params.userId
    );
    await board.save();

    res.json({ message: 'Member removed' });
  } catch (error) {
    next(error);
  }
};

exports.getMembers = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id).populate('members', '-password');
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board.members);
  } catch (error) {
    next(error);
  }
};