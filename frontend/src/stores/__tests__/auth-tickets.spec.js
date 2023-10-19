import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import socket from '../../services/socket.service.js'
import { router } from '../../router/index.js'
import { tickets } from '../../components/__tests__/mockdata/tickets.js'

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
    it('tests get tickets ok', async () => {
        global.fetch = vi.fn()

        fetch.mockResolvedValue(
            createFetchResponse({
                data: {
                    tickets: tickets
                }
            })
        )
        const store = useAuthStore()
        store.token = 'iamavalidtoken'
        store.isTokenValid = vi.fn(() => {
            return true
        })

        const gotTickets = await store.getTickets()

        expect(fetch).toHaveBeenCalledWith(
            'https://jsramverk-marjul2023.azurewebsites.net/graphql',
            {
                method: 'POST',
                body: JSON.stringify({
                    query: `{tickets {
                _id
                code
                trainnumber
                traindate
              }}`
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'x-access-token': 'iamavalidtoken'
                }
            }
        )
        expect(gotTickets).toBe(tickets)
    })

    it('tests get tickets not ok', async () => {
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

        const gotTickets = await store.getTickets()

        expect(fetch).toHaveBeenCalledWith(
            'https://jsramverk-marjul2023.azurewebsites.net/graphql',
            {
                method: 'POST',
                body: JSON.stringify({
                    query: `{tickets {
                _id
                code
                trainnumber
                traindate
              }}`
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'x-access-token': 'iamnotavalidtoken'
                }
            }
        )
        expect(gotTickets).toStrictEqual([])
    })
})
