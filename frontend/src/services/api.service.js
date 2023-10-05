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
 * Returns an array with information about delayed trains
 * @returns {Promise<array>}
 */
export const getTrainNumbers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_URL}/delayed`)
    const trains = res.data.data
    return [
        ...new Set(
            trains
                .map((item) => {
                    return item.OperationalTrainNumber
                })
                .sort()
        )
    ]
}
