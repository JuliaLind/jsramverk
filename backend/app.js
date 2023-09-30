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
const register = require("./routes/register.js");
const login = require("./routes/login.js");

// Create Express application instance and set up port
const app = express();
const port = process.env.PORT || 1337;

// Middleware
app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Root url
app.get('/', (req, res) => {
    res.json({
        data: 'Hello World!'
    });
});

// Mount routes
app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);
app.use("/register", register);
app.use("/login", login);


// Middleware for handling 404 errors (Not Found)
app.use((req, res, next) => {
    const err = new Error("Not Found");

    err.status = 404;
    next(err);
});

Error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        errors: [
            {
                status: err.status,
                title: "Not Found",
                detail: err.message
            }
        ]
    });
});

// Create an HTTP server
const httpServer = require("http").createServer(app);

// Start the HTTP server

const server = httpServer.listen(port, () => {
    console.info(`App listening on port ${port}`);
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


