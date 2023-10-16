/**
 * @module delayed
 * @description Delayed module containing function for
 * getting delayed trains from the Trafikverket API.
 */

// Node fetch module for HTTP-requests
const fetch = require('node-fetch');

/**
 * @description Delayed object for getting
 * delayed trains from the Trafikverket API.
 *
 * @property {Function} getDelayedTrains - Fetches delayed trains.
 */
const delayed = {
    transformDelayObject: function transformDelayObject(delay, stations) {
        let fromStation = "";
        let delayStation = "";
        let toStation = "";

        for (const station of stations) {
            if (delay.FromLocation && station.LocationSignature === delay.FromLocation[0].LocationName) {
                fromStation = station.AdvertisedLocationName;
            }
            if (station.LocationSignature === delay.LocationSignature) {
                delayStation = station.AdvertisedLocationName;
            }
            if (delay.ToLocation && station.LocationSignature === delay.ToLocation[0].LocationName) {
                toStation = station.AdvertisedLocationName;
            }
            if (fromStation && delayStation && toStation) {
                break;
            }
        }
        return {
            ActivityId: delay.ActivityId,
            AdvertisedTimeAtLocation: delay.AdvertisedTimeAtLocation,
            EstimatedTimeAtLocation: delay.EstimatedTimeAtLocation,
            OperationalTrainNumber: delay.OperationalTrainNumber,
            Canceled: delay.Canceled,
            FromLocation: fromStation,
            ToLocation: toStation,
            LocationSignature: delayStation,
        };
    },

    filterResult: function filterResult(delayed, stations, positions) {
        const filteredResult = [];

        for (const delay of delayed) {
            if (positions.some((position) => position.Train.OperationalTrainNumber === delay.OperationalTrainNumber)) {
                const newDelayObject = this.transformDelayObject(delay, stations);

                if (newDelayObject.FromLocation && newDelayObject.ToLocation && newDelayObject.LocationSignature) {
                    filteredResult.push(newDelayObject);
                }
            }
        }
        return filteredResult;
    },
    /**
     * @returns {Promise<array>} an array with delayed trains filtered to only include those
     * that have positionData
     */
    getFromTrafikverket: async function getFromTrafikverket() {
        const query = `<REQUEST>
        <LOGIN authenticationkey="5d9e0b327c674d279771aed90ad87616" />
        <QUERY namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" >
        <INCLUDE>Train.OperationalTrainNumber</INCLUDE>
      </QUERY>
      <QUERY objecttype="TrainAnnouncement" orderby='AdvertisedTimeAtLocation' schemaversion="1.8">
          <FILTER>
          <AND>
              <EQ name="ActivityType" value="Avgang" />
              <GT name="EstimatedTimeAtLocation" value="$now" />
              <AND>
                  <GT name='AdvertisedTimeAtLocation' value='$dateadd(-00:15:00)' />
                  <LT name='AdvertisedTimeAtLocation' value='$dateadd(02:00:00)' />
                  <EXISTS name="FromLocation" value='true' />
              </AND>
          </AND>
          </FILTER>
          <INCLUDE>ActivityId</INCLUDE>
          <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
          <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
          <INCLUDE>OperationalTrainNumber</INCLUDE>
          <INCLUDE>Canceled</INCLUDE>
          <INCLUDE>FromLocation</INCLUDE>
          <INCLUDE>ToLocation</INCLUDE>
          <INCLUDE>LocationSignature</INCLUDE>
      </QUERY>
      <QUERY objecttype="TrainStation" schemaversion="1">
      <FILTER>
          <EQ name="Advertised" value="true" />
            </FILTER>
            <INCLUDE>LocationSignature</INCLUDE>
            <INCLUDE>AdvertisedLocationName</INCLUDE>
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
        const filteredResult = this.filterResult(result.RESPONSE.RESULT[1].TrainAnnouncement, result.RESPONSE.RESULT[2].TrainStation, result.RESPONSE.RESULT[0].TrainPosition);

        return filteredResult;
    },
    /**
     * @description Fetches delayed trains from the Trafikverket API.
     * @async
     * @function
     * @param {Object} req - Express.js request object.
     * @param {Object} res - Express.js response object.
     * @returns {Promise<Object>} A JSON response containing delayed trains data.
     */
    getDelayedTrains: async function getDelayedTrains(req, res) {
        try {
            return res.json({
                data: await this.getFromTrafikverket()
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/",
                    title: "API fetch error",
                    detail: e.message
                }
            });
        }
    }
};

module.exports = delayed;
