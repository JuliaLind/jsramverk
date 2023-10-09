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
const cron = require('node-cron');
const delayedModel = require('./models/delayed.js');
const trainsModel = require('./models/trains.js');

const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');
const register = require("./routes/register.js");
const login = require("./routes/login.js");
const trains = require("./routes/trains.js");

const visual = true;
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema
} = require("graphql");

const RootQueryType = require("./graphql/root.js");
const RootMutationType = require("./graphql/ticket-mutation.js");

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
    // possible to add multiple mutation types --> mutation is then new GraphQLObjectType
    // like this
    // mutation: new GraphQLObjectType({
    //     name: 'Mutation',
    //     fields: () => ({
    //          firstMutation: FirstMutationType,
    //          secondMutation: SecondMutationType
});

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



app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual
}));

// Mount routes
app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);
app.use("/register", register);
app.use("/login", login);
app.use("/trains", trains);

// Middleware for handling 404 errors (Not Found)
app.use((req, res, next) => {
    const err = new Error("Not Found");

    err.status = 404;
    next(err);
});

// Error handling middleware
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



// app.listen({ port: port });
// console.log('Listening to port 4000');

cron.schedule('5 * * * * *', async () => {
    try {
        const delayedTrains = await delayedModel.getFromTrafikVerket();

        io.emit('delayedTrainsUpdate', delayedTrains);
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

io.on('connection', (socket) => {
    socket.on('edit-ticket', (data) => {
        socket.broadcast.emit('editing-ticket', (data));
    });
});

// Fetch train positions with socket.io
trainsModel.fetchTrainPositions(io);

// export to facilitate testing
module.exports = server;
