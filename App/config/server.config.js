const cors = require('cors');
const YAML = require('yamljs');
const express = require('express');
const swaggerUI = require('swagger-ui-express');

const { PORT } = require('./env.config');
const routes = require('../src/api/routes');
const { notFound, handler, isLoggedIn } = require('../src/middlewares');

const app = express();
const port = PORT || 5000;
const swaggerDocument = YAML.load(`${__dirname}/swagger.config.yml`);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', port);
app.use('/api', routes);
app.use('/ping', (req, res) => res.json({ message: 'Pong' }));
app.use('/intentional-failure', () => { throw new Error(); });
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/protected-route', isLoggedIn, (req, res) => res.json({ message: 'Allow to be here' }));
app.use(notFound);
app.use(handler);

module.exports = {
  app
};
