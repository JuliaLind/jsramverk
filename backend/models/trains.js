/**
 * @module trains
 * @description Trains module containing a functions for
 * getting train positions.
 */

const fetch = require('node-fetch');
const EventSource = require('eventsource');

const trains = {

    /**
    * Parses the position data from the SSE message.
    * @param {Object} data - The data received from the SSE message.
    * @param {Object} trainPositions - Object to store train positions.
    * @param {Object} socket - The WebSocket connection.
    */
    parsePositionData: function parsePositionData(data, trainPositions, socket) {
        try {
            const parsedData = JSON.parse(data);
            if (parsedData) {
                const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];

                const matchCoords = /(\d*\.\d+|\d+),?/g;

                const position = changedPosition.Position.WGS84.match(matchCoords).map((t) => parseFloat(t)).reverse();

                const trainObject = {
                    trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                    position: position,
                    timestamp: changedPosition.TimeStamp,
                    bearing: changedPosition.Bearing,
                    status: !changedPosition.Deleted,
                    speed: changedPosition.Speed,
                };

                // Emit train position updates to connected clients
                if (trainPositions.hasOwnProperty(changedPosition.Train.AdvertisedTrainNumber)) {
                    socket.emit("message", trainObject);
                }

                // Update the train positions object
                trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;

                return trainObject;
            }
        } catch (e) {
            console.log(e);
        }
    },

    /**
    * Fetches the SSE URL from the Trafikverket API.
    * @returns {Promise<string>} Promise that resolves to the SSE URL.
    */
    fetchSSEUrl: async function fetchSSEUrl() {
        // XML Query sent to the API
        const query = `<REQUEST>
            <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
            <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
            </REQUEST>`;

        // POST request to Trafikverket API to obtain SSE URL
        const response = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            body: query,
            headers: { "Content-Type": "text/xml" }
        });

        const result = await response.json();

        return result.RESPONSE.RESULT[0].INFO.SSEURL;
    },

    /**
    * Handles SSE message and emits updates to clients.
    * @param {Object} event - The SSE message event.
    * @param {Object} trainPositions - Object to store train positions.
    * @param {Object} socket - The WebSocket connection.
    */
    handleSSEMessage: function handleSSEMessage(event, trainPositions, socket) {
        try {
            const trainObject = this.parsePositionData(event.data, trainPositions, socket);

            return trainObject;
        } catch (error) {
            console.error("Error handling SSE message:", error);
        }
    },

    /**
    * Handles errors from the EventSource.
    * @param {Object} e - The error event from the EventSource.
    * @returns {Error} An error object representing the EventSource error.
    */
    handleEventSourceError: function handleEventSourceError(e) {
        const error = new Error("EventSource failed");

        error.eventSourceError = e;
        return error;
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
        try {
            const sseUrl = await this.fetchSSEUrl();

            const trainPositions = {};

            const eventSource = new EventSource(sseUrl);

            eventSource.onopen = function() {
                console.log("Connection to server opened.");
            };

            io.on('connection', (socket) => {
                console.log('a user connected');

                eventSource.onmessage = (e) => this.handleSSEMessage(e, trainPositions, socket);
            });

            eventSource.onerror = function (e) {
                throw handleEventSourceError(e);
            };
        } catch (error) {
            console.error(error.message);
            console.error("EventSource error:", error.eventSourceError);
        }
    }
}

// /**
//  * Fetches train positions in real-time and sends updates to
//  * connected clients via WebSocket.
//  *
//  * This function establishes a connection to
//  * the Trafikverket API using Server-Sent Events (SSE),
//  * listens for train position updates, and emits those updates
//  * to connected clients via a WebSocket.
//  *
//  * @async
//  * @function
//  * @param {Object} io - The Socket.IO instance used for
//  * WebSocket communication with clients.
//  *
//  * @returns {void} No return value but function sends updates to connected clients.
//  */
// async function fetchTrainPositions(io) {
//     // XML Query sent to the API
//     const query = `<REQUEST>
//     <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
//     <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
//     </REQUEST>`;

//     // Object to store train positions
//     const trainPositions = {};

//     // POST request to Trafikverket API to obtain SSE URL
//     const response = await fetch(
//         "https://api.trafikinfo.trafikverket.se/v2/data.json", {
//             method: "POST",
//             body: query,
//             headers: { "Content-Type": "text/xml" }
//         }
//     );

//     const result = await response.json();
//     const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL;

//     // Create an EventSource to listen for SSE updates
//     const eventSource = new EventSource(sseurl);

//     eventSource.onopen = function() {
//         console.log("Connection to server opened.");
//     };

//     // Handle WebSocket connections from clients
//     io.on('connection', (socket) => {
//         console.log('a user connected');

//         // Listen for SSE updates
//         eventSource.onmessage = function (e) {
//             try {
//                 const parsedData = JSON.parse(e.data);

//                 if (parsedData) {
//                     const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];

//                     const matchCoords = /(\d*\.\d+|\d+),?/g;

//                     const position = changedPosition.Position.WGS84.match(matchCoords).map((t=>parseFloat(t))).reverse();

//                     const trainObject = {
//                         trainnumber: changedPosition.Train.AdvertisedTrainNumber,
//                         position: position,
//                         timestamp: changedPosition.TimeStamp,
//                         bearing: changedPosition.Bearing,
//                         status: !changedPosition.Deleted,
//                         speed: changedPosition.Speed,
//                     };

//                     // Emit train position updates to connected clients
//                     if (trainPositions.hasOwnProperty(changedPosition.Train.AdvertisedTrainNumber)) {
//                         socket.emit("message", trainObject);
//                     }

//                     // Update the train positions object
//                     trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;
//                 }
//             } catch (e) {
//                 console.log(e);
//             }

//             return;
//         }
//     });

//     // Handle errors in the EventSource connection
//     eventSource.onerror = function(e) {
//         console.log("EventSource failed.");
//     }
// }

module.exports = trains;
