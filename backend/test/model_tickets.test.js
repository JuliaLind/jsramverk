/**
 * Test suite for tickets model.
 */

/* global it describe */

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

// Import the tickets module
const tickets = require('../models/tickets.js');

describe('tickets model', () => {
    describe('getTickets', () => {
        it('should retrieve and return data array with objects from database', async () => {
            //Mock res and req objects
            const req = {};
            const res = {
                json: sinon.stub()
            };

            // Call the getCodes function
            await tickets.getTickets(req, res);

            // Assert that the json method was called
            expect(res.json.calledOnce).to.be.true;

            // Assert that data is valid object
            const data = res.json.args[0][0].data;
            expect(data).to.be.an('array');
            expect(data[0]).to.be.an('object');
            expect(data[0]).to.have.any.keys(
                "_id",
                "code",
                "trainnumber",
                "traindate"
            );
        });
    });

    describe('createTicket', () => {
        it('should create and insert ticket into database', async () => {
            //Mock res and req objects
            process.env.NODE_ENV = 'test';

            const req = {
                body: {
                    code: "ANA002",
                    trainnumber: "123",
                    traindate: "2023-09-15"
                }
            };

            const res = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis()
            };

            // Call the createTicket function
            await tickets.createTicket(req, res);

            // Assert that the json method was called
            expect(res.json.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.args[0]).to.equal(201);

            // Assert that data is valid object
            const data = res.json.args[0][0].data;

            expect(data).to.be.an('object');
            expect(data.acknowledged).to.equal(true);
        });
    });
});