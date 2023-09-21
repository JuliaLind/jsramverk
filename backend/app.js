/**
 *
 * This is the main entry point for the backend application.
 * It sets up the Express.js server, handles routes,
 * and initializes Socket.io for real-time communication.
 *
 */

// Module imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const trains = require('./models/trains.js');
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');

// Create Express application instance and set up port
const app = express();
const port = process.env.PORT || 1337;

// Middleware
app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Root url
app.get('/', (req, res) => {
    res.json({
        data: 'Hello World!'
    })
});

// Mount routes
app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);


// Create an HTTP server
const httpServer = require("http").createServer(app);

// Start the HTTP server

const server = httpServer.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

// Configure socket.io
let io = require("socket.io")(httpServer, {
    cors: {
        origin: process.env.URL,
        methods: ["GET", "POST"]
    }
});

// Fetch train positions with socket.io
trains.fetchTrainPositions(io);



// export to facilitate testing
module.exports = server;


