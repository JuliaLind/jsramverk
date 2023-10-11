/**
 * @module codes
 * @description Code module containing function for
 * getting reason codes from the Trafikverket API.
 */

// Node fetch module for HTTP-requests
const fetch = require('node-fetch');

/**
 * @description Code object for getting
 * reason codes from the Trafikverket API.
 *
 * @property {Function} getCodes - Fetches reason codes.
 */
const codes = {
    getFromTrafikverket: async function getFromTrafikverket() {
        // XML Query sent to the API
        const query = `<REQUEST>
        <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
        <QUERY objecttype="ReasonCode" schemaversion="1">
                <INCLUDE>Code</INCLUDE>
                <INCLUDE>Level1Description</INCLUDE>
                <INCLUDE>Level2Description</INCLUDE>
                <INCLUDE>Level3Description</INCLUDE>
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

        // JSON result data
        // return await response.json();
        return result.RESPONSE.RESULT[0].ReasonCode;
    },
    /**
     * @description Fetches reason codes from the Trafikverket API.
     * @async
     * @function
     * @param {Object} req - Express.js request object.
     * @param {Object} res - Express.js response object.
     * @returns {Promise<Object>} A JSON response containing reason codes data.
     */
    getCodes: async function getCodes(req, res) {
        try {
            const result = await this.getFromTrafikverket();

            return res.json({
                data: result
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

module.exports = codes;
