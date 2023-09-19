/**
 * Test suite for delayed model.
 */

/* global it describe */

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

// Import the delayed module
const delayed = require('../models/delayed.js');

describe('delayed model', () => {
    describe('getDelayedTrains', () => {
        it('should send post request to api and return data array with objects', async () => {
            //Mock res and req objects
            const req = {};
            const res = {
                json: sinon.stub()
            };

            // Call the getCodes function
            await delayed.getDelayedTrains(req, res);

            // Assert that the json method was called
            expect(res.json.calledOnce).to.be.true;

            // Assert that data is valid object
            const data = res.json.args[0][0].data;

            expect(data).to.be.an('array');
            expect(data[0]).to.be.an('object');
            expect(data[0]).to.have.any.keys(
                "ActivityId",
                "ActivityType",
                "AdvertisedTrainIdent",
                "Canceled"
            );
            expect(data[0].ActivityId.length).to.equals(36);
        });
    });
});