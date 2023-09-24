import axios from 'axios'
/**
 * Returns an array with information about delayed trains
 * @returns {Promise<array>}
 */
export const getDelayedTrains = async () => {
    const res = await axios.get(`${import.meta.env.VITE_URL}/delayed`)
    return res.data.data
}
/**
 * Return an array with reason code-data
 * @returns {Promise<array>}
 */
export const getCodes = async () => {
    const res = await axios.get(`${import.meta.env.VITE_URL}/codes`)
    return res.data.data
}
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
export const submitNewTicket = async (newTicketObject) => {
    const res = await axios.post(
        `${import.meta.env.VITE_URL}/tickets`,
        newTicketObject
    )
    return res.data;
}

/**
 * @returns {Promise<array>} previous tickets
 */
export const getTickets = async () => {
    const res = await axios.get(`${import.meta.env.VITE_URL}/tickets`)
    return res.data.data
}
