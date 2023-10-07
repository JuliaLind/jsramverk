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
    /**
     * @returns {Array} an array with delayed trains filtered to only include those
     * that have positionData
     */
    getFromTrafikVerket: async function getFromTrafikVerket() {
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
                  <LT name='AdvertisedTimeAtLocation'                   value='$dateadd(02:00:00)' />
              </AND>
          </AND>
          </FILTER>
          <INCLUDE>ActivityId</INCLUDE>
          <INCLUDE>ActivityType</INCLUDE>
          <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
          <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
          <INCLUDE>AdvertisedTrainIdent</INCLUDE>
          <INCLUDE>OperationalTrainNumber</INCLUDE>
          <INCLUDE>Canceled</INCLUDE>
          <INCLUDE>FromLocation</INCLUDE>
          <INCLUDE>ToLocation</INCLUDE>
          <INCLUDE>LocationSignature</INCLUDE>
          <INCLUDE>TimeAtLocation</INCLUDE>
          <INCLUDE>TrainOwner</INCLUDE>
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
        const delayed = result.RESPONSE.RESULT[1].TrainAnnouncement;
        const positions = result.RESPONSE.RESULT[0].TrainPosition;
        const delayedWithPositionData = [];

        for (const delay of delayed) {
            if (positions.some((position) => position.Train.OperationalTrainNumber === delay.OperationalTrainNumber)) {
                delayedWithPositionData.push(delay);
            }
        }

        return delayedWithPositionData;
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
                data: await this.getFromTrafikVerket()
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
