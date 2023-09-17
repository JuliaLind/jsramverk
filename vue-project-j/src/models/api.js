const api = {
    /**
     * Returns an array with information about delayed trains
     * @returns {Promise<array>}
     */
    getDelayedTrains: async function getDelayedTrains() {
            const res = await fetch(`${import.meta.env.VITE_URL}/delayed`);
            const delayed = await res.json();
            return delayed.data;
    },
    /**
     * Return an array with reason code-data
     * @returns {Promise<array>}
     */
    getCodes: async function getCodes() {
        const res = await fetch(`${import.meta.env.VITE_URL}/codes`);
        const data = await res.json();
        return data.data;
    },
    /**
     * 
     * @param {Object} newTicketObject An object containing reasoncode,
     * trainnumber and traindate
     * @returns {Promise<array>} response - contains
     * the document number for the submitted ticket
     * @example {
     *    "data": {
     *        "acknowledged": true,
     *        "insertedId": "6504bccfa00196da499d69d1"
     *    }
     * }
     */
    submitNewTicket: async function submitNewTicket(newTicketObject) {
        const res = await fetch(`${import.meta.env.VITE_URL}/tickets`, {
            body: JSON.stringify(newTicketObject),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        // return response;
        const data = await res.json();
        return data.data;
    },
    /**
     * @returns {Promise<array>} previous tickets
     */
    getTickets: async function getTickets() {
        const res = await fetch(`${import.meta.env.VITE_URL}/tickets`);
        const data = await res.json();
        return data.data;
    }
};

export default api
