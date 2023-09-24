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
     * @description Fetches delayed trains from the Trafikverket API.
     * @async
     * @function
     * @param {Object} req - Express.js request object.
     * @param {Object} res - Express.js response object.
     * @returns {Promise<Object>} A JSON response containing delayed trains data.
     */
    getDelayedTrains: async function getDelayedTrains(req, res) {
        // XML Query sent to the API
        const query = `<REQUEST>
                  <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
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

        // JSON result data
        const result = await response.json();

        return res.json({
            data: result.RESPONSE.RESULT[0].TrainAnnouncement
        });
    }
};

module.exports = delayed;
