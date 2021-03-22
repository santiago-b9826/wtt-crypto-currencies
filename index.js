const Express = require('express');
const { server } = require('./App/config');

const app = new Express();
server(app);
