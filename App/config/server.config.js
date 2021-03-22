const cors = require('cors');
const express = require('express');

const { PORT } = require('./env.config');
const routes = require('../src/api/routes');

const app = express();
const port = PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', port);
app.use('/api', routes);
app.use('/ping', (req, res) => res.json({ message: 'Pong' }));

module.exports = {
  app
};
