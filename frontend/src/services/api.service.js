import { loader } from './loader.service.js'

/**
 * Returns an array with information about delayed trains
 * @returns {Promise<array>}
 */
export const getDelayedTrains = async () => {
    loader.show()
    const query = `{delayed {
        ActivityId
        AdvertisedTimeAtLocation
        EstimatedTimeAtLocation
        OperationalTrainNumber
        Canceled
        FromLocation
        ToLocation
        LocationSignature
    }}`
    const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({ query: query })
    })

    const result = await response.json()
    loader.hide()
    return result.data.delayed
}

/**
 * Returns an array with information about current positions
 * of the trains
 * @returns {Promise<array>}
 */
export const getInitialPositions = async () => {
    const query = `{positions {
        trainnumber
        position
    }}`
    const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({ query: query })
    })

    const result = await response.json()

    return result.data.positions
}

/**
 * Return an array with reason code-data
 * @returns {Promise<array>}
 */
export const getCodes = async () => {
    const query = `{codes {
        Code
        Level3Description
    }}`
    const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({ query: query })
    })

    const result = await response.json()

    return result.data.codes
}

/**
 * Extracts and returns a sorted array with unique trainnumbers
 * from an array with delay objects
 * @param {array} delayed
 * @returns {array}
 */
export const extractTrainNumbers = (delayed) => {
    return [
        ...new Set(
            delayed
                .map((item) => {
                    return item.OperationalTrainNumber
                })
                .sort()
        )
    ]
}

/**
 * fetches an array with trainnumbers of all delay objects
 * and extracts and returns unique trainnumbers in
 * a sorted array
 * @returns {array} awway with trainnumbers to be used in
 * the select menu of NewTicket component
 */
export const getTrainNumbers = async () => {
    const query = `{delayed {
        OperationalTrainNumber
    }}`
    const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({ query: query })
    })
    const result = await response.json()
    const delayed = result.data.delayed

    return extractTrainNumbers(delayed)
}
