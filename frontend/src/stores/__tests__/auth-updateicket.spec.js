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
    it('tests update ticket ok', async () => {
        global.fetch = vi.fn()

        fetch.mockResolvedValue(
            createFetchResponse({
                data: {
                    updateTicket: {
                        _id: 'iamaticketid',
                        code: 'ABC030',
                        trainnumber: '99999',
                        traindate: '2023-10-18'
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
            updateTicket(_id: "iamaticketid", code: "ABC030") {
                _id
                code
                trainnumber
            }
        }
        `

        await store.updateTicket(ticket)

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
        expect(socket.emit).toHaveBeenCalledWith('updated', {
            _id: 'iamaticketid',
            code: 'ABC030',
            trainnumber: '99999',
            traindate: '2023-10-18'
        })
        expect(store.isTokenValid).toBeCalledTimes(1)
        expect(toast).toBeCalledTimes(1)
        expect(toast).toHaveBeenCalledWith('Du har uppdaterat ärende iamaticketid!')
    })

    it('tests update ticket not ok', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                errors: {
                    detail: 'Some error'
                }
            })
        )
        const store = useAuthStore()

        store.token = 'iamavalidtoken'
        store.isTokenValid = vi.fn(() => {
            return false
        })
        const ticket = `
            mutation {
                updateTicket(_id: "iamaticketid", code: "ABC030") {
                    _id
                    code
                    trainnumber
                }
            }
            `

        await store.updateTicket(ticket)

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
        expect(socket.emit).toBeCalledTimes(0)
        expect(store.isTokenValid).toBeCalledTimes(1)
        expect(toast).toBeCalledTimes(0)
    })
})
