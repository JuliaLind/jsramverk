/**
 * @module trains
 * @description Trains module containing a functions for
 * getting train positions.
 */

const fetch = require('node-fetch');
const EventSource = require('eventsource');

const trains = {
    getFromTrafikverket: async function getFromTrafikverket() {
        const query = `<REQUEST>
        <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
        <QUERY namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" >
            <INCLUDE>Train.OperationalTrainNumber</INCLUDE>
            <INCLUDE>Position.WGS84</INCLUDE>
        </QUERY>
        </REQUEST>`;

        // HTTP response
        const response = await fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" }
            }
        );
        const result = await response.json();
        const initialPositions = [];

        for (const position of result.RESPONSE.RESULT[0].TrainPosition) {
            initialPositions.push(this.transformPositionObject(position));
        }
        return initialPositions;
    },

    // picks out coordinates from position data and converts to correct form
    getCoords: function getCoords(positionDataObject) {
        const matchCoords = /(\d*\.\d+|\d+),?/g;
        const position = positionDataObject.Position.WGS84.match(matchCoords).map((t) => parseFloat(t)).reverse();

        return position;
    },

    transformPositionObject: function transformPositionObject(position) {
        return {
            trainnumber: position.Train.OperationalTrainNumber,
            position: this.getCoords(position),
        };
    },

    /**
    * Parses the position data from the SSE message.
    * @param {Object} data - The data received from the SSE message.
    * @param {Object} trainPositions - Object to store train positions.
    * @param {Object} socket - The WebSocket connection.
    */
    parsePositionData: function parsePositionData(data, trainPositions, socket) {
        // try {
        const parsedData = JSON.parse(data);
        const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];
        const trainObject = this.transformPositionObject(changedPosition);

        // Emit train position updates to connected clients
        if (changedPosition.Train.OperationalTrainNumber in trainPositions) {
            socket.emit("trainpositions", trainObject);
        }

        // Update the train positions object
        trainPositions[changedPosition.Train.OperationalTrainNumber] = trainObject;

        return trainObject;
    },

    /**
    * Fetches the SSE URL from the Trafikverket API.
    * @returns {Promise<string>} Promise that resolves to the SSE URL.
    */
    fetchSSEUrl: async function fetchSSEUrl() {
        // XML Query sent to the API
        const query = `<REQUEST>
            <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
            <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1">
                <INCLUDE>Train.OperationalTrainNumber</INCLUDE>
                <INCLUDE>Position.WGS84</INCLUDE>
            </QUERY>
            </REQUEST>`;

        // POST request to Trafikverket API to obtain SSE URL
        const response = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            body: query,
            headers: { "Content-Type": "text/xml" }
        });

        const result = await response.json();

        // console.log(result.RESPONSE.RESULT[0]);

        return result.RESPONSE.RESULT[0].INFO.SSEURL;
    },

    /**
    * Handles SSE message and emits updates to clients.
    * @param {Object} event - The SSE message event.
    * @param {Object} trainPositions - Object to store train positions.
    * @param {Object} socket - The WebSocket connection.
    */
    handleSSEMessage: function handleSSEMessage(event, trainPositions, socket) {
        // try {
        const trainObject = this.parsePositionData(event.data, trainPositions, socket);

        return trainObject;
    },

    /**
    * Fetches train positions in real-time and sends updates to
    * connected clients via WebSocket.
    *
    * This function establishes a connection to
    * the Trafikverket API using Server-Sent Events (SSE),
    * listens for train position updates, and emits those updates
    * to connected clients via a WebSocket.
    *
    * @async
    * @function
    * @param {Object} io - The Socket.IO instance used for
    * WebSocket communication with clients.
    *
    * @returns {void} No return value but function sends updates to connected clients.
    */
    fetchTrainPositions: async function fetchTrainPositions(io) {
        const sseUrl = await this.fetchSSEUrl();

        const trainPositions = {};

        const eventSource = new EventSource(sseUrl);

        eventSource.onopen = function() {
            console.info("Connection to server opened.");
        };

        io.on('connection', (socket) => {
            console.info('a user connected');

            eventSource.onmessage = (e) => this.handleSSEMessage(e, trainPositions, socket);
        });

        eventSource.onerror = function (e) {
            console.error(e.message);
            console.error("EventSource error:", e.eventSourceError);
        };
    }
};

module.exports = trains;
