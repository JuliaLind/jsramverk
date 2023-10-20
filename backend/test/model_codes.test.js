/**
 * Test suite for codes model.
 */

/* global it describe */

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

// Import the codes module
const codes = require('../models/codes.js');

describe('codes model', () => {
    describe('getCodes', () => {
        it('should send post request to api and return data array with objects', async () => {
            const data = await codes.getFromTrafikverket();


            expect(data).to.be.an('array');
            expect(data[0]).to.be.an('object');
            expect(data[0]).to.have.any.keys(
                "Code",
                "Level1Description",
                "Level2Description",
                "Level3Description"
            );
        });
    });
});