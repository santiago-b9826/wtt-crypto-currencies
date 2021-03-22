/* eslint-disable no-console */
const cors = require('cors');
const express = require('express');

const { PORT } = require('./env.config');
const connection = require('./db.config');
const routes = require('../src/api/routes');

const app = express();
const port = PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', port);
app.use('/api', routes);
app.use('/ping', (req, res) => res.json({ message: 'Pong' }));

const server = async () => {
  try {
    await connection();
    console.log('DB Connection was successfully established');
    app.listen(app.get('port'), () => {
      console.log(`The app is listening on the port ${app.get('port')}`);
    });
  } catch (error) {
    console.error('Error launch application');
    process.exit(1);
  }
};

module.exports = {
  server
};
