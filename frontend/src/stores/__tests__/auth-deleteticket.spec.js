import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import socket from '../../services/socket.service.js'
import { toast } from '../../services/alert.service.js'
import { router } from '../../router/index.js'

router.push = vi.fn()

socket.emit = vi.fn()
socket.on = vi.fn()

vi.mock('../../services/alert.service.js', () => {
    return {
        toast: vi.fn(),
        customAlert: vi.fn()
    }
})

function createFetchResponse(data) {
    return { json: () => new Promise((resolve) => resolve(data)) }
}

describe('auth-store', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    it('tests delete ticket ok', async () => {
        global.fetch = vi.fn()

        fetch.mockResolvedValue(
            createFetchResponse({
                data: {
                    deleteTicket: {
                        _id: 'iwasdeletedid'
                    }
                }
            })
        )
        const store = useAuthStore()
        store.token = 'iamavalidtoken'
        store.isTokenValid = vi.fn(() => {
            return true
        })
        const ticket = `
        mutation {
            deleteTicket(_id: "iwasdeletedid") {
                _id
            }
        }
    `

        await store.deleteTicket(ticket)

        expect(fetch).toHaveBeenCalledWith(
            'https://jsramverk-marjul2023.azurewebsites.net/graphql',
            {
                method: 'POST',
                body: JSON.stringify({ query: ticket }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'x-access-token': 'iamavalidtoken'
                }
            }
        )
        expect(socket.emit).toBeCalledTimes(1)
        expect(socket.emit).toHaveBeenCalledWith('refresh-tickets')
        expect(store.isTokenValid).toBeCalledTimes(1)
        expect(toast).toBeCalledTimes(1)
        expect(toast).toHaveBeenCalledWith('Du har raderat ärende iwasdeletedid')
    })

    it('tests delete ticket not ok', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                errors: {
                    detail: 'Some error'
                }
            })
        )
        const store = useAuthStore()

        store.token = 'iamnotavalidtoken'
        store.isTokenValid = vi.fn(() => {
            return false
        })
        const ticket = `
            mutation {
                updateTicket(_id: "iwasdeletedid") {
                    _id
                }
            }
            `

        await store.deleteTicket(ticket)

        expect(fetch).toHaveBeenCalledWith(
            'https://jsramverk-marjul2023.azurewebsites.net/graphql',
            {
                method: 'POST',
                body: JSON.stringify({ query: ticket }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'x-access-token': 'iamnotavalidtoken'
                }
            }
        )
        expect(socket.emit).toBeCalledTimes(0)
        expect(store.isTokenValid).toBeCalledTimes(1)
        expect(toast).toBeCalledTimes(0)
    })
})
