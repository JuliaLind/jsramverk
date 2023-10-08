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
 * Returns an array with information about delayed trains
 * @returns {Promise<array>}
 */
export const getInitialPositions = async () => {
    const res = await axios.get(`${import.meta.env.VITE_URL}/trains`)
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

export const getTrainNumbers = async () => {
    const trainnumbers = await getDelayedTrains()
    return [
        ...new Set(
            trainnumbers
                .map((item) => {
                    return item.OperationalTrainNumber
                })
                .sort()
        )
    ]
}
