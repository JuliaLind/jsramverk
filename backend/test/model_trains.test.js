// /**
//  * Test suite for trains model.
//  */

// /* global it describe */

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const trainsModel = require('../models/trains.js'); 

const expect = chai.expect;
chai.use(chaiHttp);

describe('Trains Model', () => {
    let ioStub;

    beforeEach(() => {
        ioStub = {
            on: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('parsePositionData', () => {
        it('should parse position data correctly', () => {
            const data = '{"RESPONSE":{"RESULT":[{"TrainPosition":[{"Position":{"WGS84":"12.34,56.78"},"Train":{"AdvertisedTrainNumber":"12345"},"TimeStamp":"2023-09-18T12:34:56Z","Bearing":120.5,"Deleted":false,"Speed":80.2}]}]}}';
            const trainPositions = {
                "12345": ""
            };

            const socket = {
                emit: sinon.stub(),
            };

            const trainObject = trainsModel.parsePositionData(data, trainPositions, socket);

            expect(trainObject).to.deep.equal({
                trainnumber: '12345',
                position: [56.78, 12.34],
                timestamp: '2023-09-18T12:34:56Z',
                bearing: 120.5,
                status: true,
                speed: 80.2,
            });

            expect(socket.emit.calledOnce).to.be.true;
            expect(socket.emit.calledWith('trainpositions')).to.be.true;
        });
        it('should throw error', () => {
            const data = undefined;
            const trainPositions = {
                "12345": ""
            };

            const socket = {
                emit: sinon.stub(),
            };

            expect(function () {
                trainsModel.parsePositionData(data, trainPositions, socket)
            }).to.throw(SyntaxError);


            expect(socket.emit.neverCalledWith('trainpositions')).to.be.true;
        });
    });

    describe('fetchSSEUrl', () => {
        it('should fetch SSE URL', async () => {
            const sseUrl = await trainsModel.fetchSSEUrl();

            expect(sseUrl).to.include('https://api.trafikinfo.trafikverket.se/v2/data.json?');
        });
    });

    describe('handleSSEMessage', () => {
        it('should handle SSE message correctly', () => {
            const e = {
                data: '{"RESPONSE":{"RESULT":[{"TrainPosition":[{"Position":{"WGS84":"12.34,56.78"},"Train":{"AdvertisedTrainNumber":"12345"},"TimeStamp":"2023-09-18T12:34:56Z","Bearing":120.5,"Deleted":false,"Speed":80.2}]}]}}',
            };
            const trainPositions = {
                "12345": ""
            };

            const socket = {
                emit: sinon.stub(),
            };

            const trainObject = trainsModel.handleSSEMessage(e, trainPositions, socket);

            expect(trainObject).to.deep.equal({
                trainnumber: '12345',
                position: [56.78, 12.34],
                timestamp: '2023-09-18T12:34:56Z',
                bearing: 120.5,
                status: true,
                speed: 80.2,
            });

            expect(socket.emit.calledOnce).to.be.true;
            expect(socket.emit.calledWith('trainpositions')).to.be.true;
        });
        it('should throw error', () => {
            const e = {
                data: undefined,
            };
            const trainPositions = {
                "12345": ""
            };

            const socket = {
                emit: sinon.stub(),
            };

            expect(function () {
                trainsModel.handleSSEMessage(e, trainPositions, socket);
            }).to.throw(SyntaxError);


            expect(socket.emit.neverCalledWith('trainpositions')).to.be.true;
        });
    });

    describe('handleEventSourceError', () => {
        it('should handle EventSource error correctly', () => {
            const error = new Error('EventSource failed');

            const result = trainsModel.handleEventSourceError(error);

            expect(result).to.be.an('error');
            expect(result.message).to.equal('EventSource failed');
        });
    });

    describe('fetchTrainPositions', () => {
        it('should fetch train positions and set up event handling', async () => {
            ioStub.on.withArgs('connection').callsArgWith(1, {
                on: sinon.stub(),
            });

            await trainsModel.fetchTrainPositions(ioStub);

            expect(ioStub.on.calledOnce).to.be.true;
            expect(ioStub.on.calledWith('connection')).to.be.true;
        });
    });
});