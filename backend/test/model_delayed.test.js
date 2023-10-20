/**
 * Test suite for delayed model.
 */

/* global it describe */

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const trafikverketData = require("./mocks/trafikverket-delayed.js").trafikverketResult.RESPONSE.RESULT;
const stations = trafikverketData[2].TrainStation;
const resultData = require("./mocks/delayed-result.js").delayedResult;
const announcementOk = require("./mocks/announcement-ok.js").announcementOk;
const announcementOkResult = require("./mocks/announcement-ok.js").announcementOkResult;
const announcementNotOk = require("./mocks/announcement-not-ok.js").announcementNotOk;
const announcementNotOkResult = require("./mocks/announcement-not-ok.js").announcementNotOkResult;



// Import the delayed module
const delayed = require('../models/delayed.js');

describe('delayed model', () => {
    describe('getDelayedTrains', () => {
        it('should send post request to api and return data array with objects', async () => {
            const data = await delayed.getFromTrafikverket()

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

    describe('filterResult', () => {
        it('should only filter out stations that have position data and from/to location info', async () => {
            const positionData = trafikverketData[0].TrainPosition;
            const delayedData = trafikverketData[1].TrainAnnouncement;
            const filteredData = delayed.filterResult(delayedData, stations, positionData);

            expect(filteredData).to.eql(resultData);
        });
    });

    describe('transformDelayObject ok', () => {
        it('transforms a delay object that has to/from station info', async () => {
            const transformed = delayed.transformDelayObject(announcementOk, stations);

            expect(transformed).to.eql(announcementOkResult);
        });
    });

    describe('transformDelayObject Not ok', () => {
        it('transforms a delay object that does not have to/from station info', async () => {
            const transformed = delayed.transformDelayObject(announcementNotOk, stations);

            expect(transformed).to.eql(announcementNotOkResult);
        });
    });
});