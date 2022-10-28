// Get dependencies.
import { app } from './app.js';
import http from 'http';

// Get port from environment and store in Express.
const port = process.env.PORT || 3000;
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port
server.listen(port);
