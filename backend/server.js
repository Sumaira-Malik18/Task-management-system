const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/tasks', require('./routes/taskRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Task Manager API'));

app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
