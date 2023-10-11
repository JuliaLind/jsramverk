/**
 * Returns an array with information about delayed trains
 * @returns {Promise<array>}
 */
export const getDelayedTrains = async () => {
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
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query: query })
    })

    const result = await response.json()
    console.log("from api service", result.data)
    return result.data.delayed;
}

/**
 * Returns an array with information about delayed trains
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
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query: query })
    })

    const result = await response.json()

    return result.data.positions;
}

/**
 * Return an array with reason code-data
 * @returns {Promise<array>}
 */
export const getCodes = async () => {
    const query = `{codes {
        Code
        Level1Description
        Level2Description
        Level3Description
      }}`
    const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query: query })
    })

    const result = await response.json()

    return result.data.codes;
}

export const getTrainNumbers = async () => {
    const query = `{delayed {
        OperationalTrainNumber
      }}`
    const response = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query: query })
    })

    const result = await response.json()

    const trainnumbers = result.data.delayed;

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
