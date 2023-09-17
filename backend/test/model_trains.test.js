// /**
//  * Test suite for trains model.
//  */

// /* global it describe */

// const chai = require('chai');
// const expect = chai.expect;

// const fetchTrainPositions = require('../models/trains.js');

// describe('trains Module', () => {
//     describe('fetchTrainPositions', () => {
//         it('should connect to the Trafikverket API and establish a connection via EventSource', () => {
//             // Mock Socket.IO instance
//             const io = {
//                 on: (event, callback) => {
//                     // Simulate 'connection' event
//                     if (event === 'connection') {
//                         callback({
//                             emit: (eventName, data) => {
//                                 // Assert that train position updates are emitted
//                                 expect(eventName).to.equal('message');
//                                 expect(data).to.be.an('object');
//                             }
//                         });
//                     }
//                 }
//             };

//             fetchTrainPositions(io);
//         });
//     });
// });