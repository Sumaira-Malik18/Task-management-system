const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => res.send('Task Manager API'));
app.listen(5000, () => console.log('Server on port 5000'));