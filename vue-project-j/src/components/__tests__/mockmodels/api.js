/**
 *
 * @module Api Mocked api methods replacing
 * actual api requests in components when testing
 *
 */

const delayedData = require('../mockdata/delayed.json');

const api = {
    /**
     * Returns an array with information about delayed trains
     * @returns {Array}
     */
    getDelayedTrains: function getDelayedTrains() {
        const delayedTrains = delayedData.data;

        const result = {
            status: 200,
            data: delayedTrains
        }

        return result;
    }
}

module.exports = api;
