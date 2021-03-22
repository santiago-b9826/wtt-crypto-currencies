/* eslint-disable no-console */
const { app, connection } = require('./App/config');

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

server();
