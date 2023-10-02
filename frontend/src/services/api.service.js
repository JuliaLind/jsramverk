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
