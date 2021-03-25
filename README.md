# Wolox Technical Test- Crypto Currencies API | [![JavaScript Style Guide](https://img.shields.io/badge/code_style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript) 

## How to use
### Prerrequisites 📋 
Make sure you have [Node.js](http://nodejs.org/) v14.15.1 or higher and [npm](https://www.npmjs.com/) v6.14.8 or higher.

### Environment Vars :exclamation:
To run this project, you need to provide some environment variables, wich are listed in [env.config.js](https://github.com/santiago-b9826/wtt-crypto-currencies/blob/master/App/config/env.config.js). A ``.env`` file can be provided in order to load environment variables. **Don't forget them**.

### Run locally 🔧
```sh
git clone https://github.com/santiago-b9826/wtt-crypto-currencies.git # or clone your own way
cd wtt-crypto-currencies # change to the project folder
npm install # Install dependencies
npm start # Start 🚀
```
And finally you can go to http://localhost:5000/api-docs (Or your preferred port)

#### Debug :bug:
If yuo are a Visual Studio Code user, this project contains a configuration to run and debug directly in the editor. Go to ``Run and Debug`` or execute keyboard shortcut *Ctrl + Shift + D* and select the configuration named **Dev Wolox Technical Test**. You must have *nodemon* globally or run this command:
```sh
npm i -g nodemon
```

### Run Tests ⚙️
Currently the project only has integration tests that is a type of testing where software modules are integrated logically and tested as a group<sup>[1](https://www.guru99.com/integration-testing.html)</sup>
To only Run the test execute:
```sh
npm test
```

To see the code coverage and run the test execute:
```sh
npm run coverage
```

## Deploy 📦
The project is currently deployed on heroku, it has two environments [Development](https://wtt-crypto-currencies-dev.herokuapp.com/) and [Production](https://wtt-crypto-currencies.herokuapp.com/). 

## User Docs 📖
The user documentation is available in [Swagger Docs](https://wtt-crypto-currencies-dev.herokuapp.com/api-docs). Remember to select the appropriate server to make the requests.

Some resources are protected by a *Bearer Token*, this token can be obtained by creating a user and logging in with the credentials.

## Conventions :handshake:
This project follows the [Airbnb Style Guide](https://github.com/airbnb/javascript), by making little modifications and exemptions for write a standard code, so do not forget to activate the lint tools for your code editor. 

Use the [Git Workflow](https://www.atlassian.com/es/git/tutorials/comparing-workflows/gitflow-workflow) to defines a strict branching model designed around project publishing. Provides a solid framework for managing larger projects. The only branch that is not used is the *release branch*.

The branches **master** and **develop** are protected and required status checks to pass before merging, currently, the only status check available is the provided by the integration tests.

## Technologies used 🛠️
* [Nodejs](https://nodejs.org/)
* [Npm](https://www.npmjs.com/)
* [Express](https://expressjs.com/)
* [Axios](https://www.npmjs.com/package/axios)
* [Joi](https://www.npmjs.com/package/joi)
* [Nodemon](https://nodemon.io/)
* [Mocha](https://mochajs.org/)
* [Chai](https://www.chaijs.com/)
* [Supertest](https://www.npmjs.com/package/supertest)
* [Istanbul nyc](https://istanbul.js.org/)
* [Mongoose](https://mongoosejs.com/)
* [Swagger](https://swagger.io/)

## Authors :coffee:
* [Santiago Bedoya](https://github.com/santiago-b9826)