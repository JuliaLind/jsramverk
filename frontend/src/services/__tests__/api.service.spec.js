import { extractTrainNumbers, getDelayedTrains, getInitialPositions, getCodes, getTrainNumbers } from '../api.service.js'
import { delayed } from '../../components/__tests__/mockdata/delayed.js'
import { vi, afterEach, describe, expect, it } from 'vitest'
import { loader } from '../../services/loader.service.js'
import { codes } from '../../components/__tests__/mockdata/codes.js'
import { positions } from '../../components/__tests__/mockdata/positions.js'

loader.show = vi.fn()
loader.hide = vi.fn()

function createFetchResponse(data) {
    return { json: () => new Promise((resolve) => resolve(data)) }
}

describe('extractTrainNumbers', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })
    const delayedQuery = `{delayed {
        ActivityId
        AdvertisedTimeAtLocation
        EstimatedTimeAtLocation
        OperationalTrainNumber
        Canceled
        FromLocation
        ToLocation
        LocationSignature
    }}`
    const positionsQuery = `{positions {
        trainnumber
        position
    }}`
    const codesQuery = `{codes {
        Code
        Level3Description
    }}`
    const trainnumbersQuery = `{delayed {
        OperationalTrainNumber
    }}`
    const trainnumbers = [
        '10168',
        '13066',
        '13087',
        '1543',
        '20096',
        '20327',
        '20336',
        '3751',
        '527',
        '8013',
        '8136',
        '8739'
    ]
    it('extracts unique trainnumbers from an array with delay items, in sorted order', () => {
        expect(extractTrainNumbers(delayed)).toStrictEqual(trainnumbers)
    })

    it('tests getDelayedTrains', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                data: {
                    delayed: delayed
                }
            })
        )
        const data = await getDelayedTrains()

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ query: delayedQuery }),
        })
        expect(loader.show).toBeCalledTimes(1)
        expect(data).toBe(delayed);
        expect(loader.hide).toBeCalledTimes(1)
    })
    it('tests getInitialPositions', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                data: {
                    positions: positions
                }
            })
        )
        const data = await getInitialPositions()

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ query: positionsQuery }),
        })
        expect(data).toBe(positions);
    })

    it('tests getCodes', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                data: {
                    codes: codes
                }
            })
        )
        const data = await getCodes()

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ query: codesQuery }),
        })
        expect(data).toStrictEqual(codes);
    })

    it('tests getTrainNumbers', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                data: {
                    delayed: delayed
                }
            })
        )
        const data = await getTrainNumbers()

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ query: trainnumbersQuery }),
        })
        expect(data).toStrictEqual(trainnumbers);
    })
})
