const Task = require('../models/Task');

exports.getTasks = async (req, res, next) => {
  try {
    const filter = { list: req.params.listId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    const tasks = await Task.find(filter).populate('assignee', '-password');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, list: req.params.listId });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignee', '-password');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.assignTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { assignee: req.body.userId }, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { text: req.body.text, user: req.user.id } } },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
exports.moveTask = async (req, res, next) => {
  try {
    const { listId } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { list: listId },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};