const express = require('express');
const router = express.Router({ mergeParams: true });
const List = require('../models/List');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const lists = await List.find({ board: req.params.boardId });
    res.json(lists);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const list = await List.create({ ...req.body, board: req.params.boardId });
    res.status(201).json(list);
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(list);
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: 'List deleted' });
  } catch (error) { next(error); }
});

module.exports = router;