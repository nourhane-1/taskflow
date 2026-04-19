const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/error.middleware');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/boards', require('./routes/board.routes'));
app.use('/api/boards/:boardId/lists', require('./routes/list.routes'));
app.use('/api/lists/:listId/tasks', require('./routes/task.routes'));
app.use('/api/tasks', require('./routes/task.routes'));

app.use(errorMiddleware);

module.exports = app;