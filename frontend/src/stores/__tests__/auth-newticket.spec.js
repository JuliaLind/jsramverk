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
    it('tests submit new ticket ok', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                data: {
                    createTicket: {
                        _id: 'thisisaticketid'
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
                createTicket(code: "ANA020", trainnumber: "12345", traindate: "2023-10-18") {
                    _id
                    code
                }
            }
        `

        await store.submitNewTicket(ticket)

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
        expect(toast).toHaveBeenCalledWith('Du har skapat ett nytt ärende med id thisisaticketid!')
    })
    it('tests submit new ticket not ok', async () => {
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
                createTicket(code: "ANA020", trainnumber: "12345", traindate: "2023-10-18") {
                    _id
                    code
                }
            }
        `

        await store.submitNewTicket(ticket)

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
