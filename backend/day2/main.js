//main entry file to execture

// const serverService = require('./server');
// const authService = require('./auth');

import { 
    server as serverService, exampleFunction} from './server.js';
import authService from './auth.js';

//we have to exectue it

exampleFunction()
authService()
// serverService()