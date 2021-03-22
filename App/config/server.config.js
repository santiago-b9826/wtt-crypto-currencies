const cors = require('cors');
const express = require('express');

const { PORT } = require('./env.config');
const routes = require('../src/api/routes');
const { notFound, handler } = require('../src/middlewares');

const app = express();
const port = PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', port);
app.use('/api', routes);
app.use('/ping', (req, res) => res.json({ message: 'Pong' }));
app.use('/intentional-failure', () => { throw new Error(); });
app.use(notFound);
app.use(handler);

module.exports = {
  app
};
