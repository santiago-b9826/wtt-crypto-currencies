/* eslint-disable no-console */
const { app, connection } = require('./App/config');
const { MONGO_URL } = require('./App/config/env.config');

const server = async () => {
  try {
    await connection(MONGO_URL);
    console.log('DB Connection was successfully established');
    app.listen(app.get('port'), () => {
      console.log(`The app is listening on the port ${app.get('port')}`);
    });
  } catch (error) {
    console.error('Error launch application');
    process.exit(1);
  }
};

server();
