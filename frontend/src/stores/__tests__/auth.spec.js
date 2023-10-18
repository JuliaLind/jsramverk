import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import socket from '../../services/socket.service.js'
import { loader } from '../../services/loader.service.js'
import { customAlert, toast } from '../../services/alert.service.js'
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

loader.show = vi.fn()
loader.hide = vi.fn()

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

    it('tests login ok', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                data: {
                    token: 'thisisavalidtoken',
                    user: {
                        email: 'myemail@email.com',
                        name: 'My Name'
                    }
                }
            })
        )
        const store = useAuthStore()
        await store.login('myemail@email.com', 'mypassword')

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/login', {
            method: 'POST',
            body: JSON.stringify({
                email: 'myemail@email.com',
                password: 'mypassword'
            }),
            headers: {
                // Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        expect(socket.emit).toBeCalledTimes(1)
        expect(socket.emit).toHaveBeenCalledWith('logged-in', 'thisisavalidtoken')
        expect(loader.show).toBeCalledTimes(1)
        expect(loader.hide).toBeCalledTimes(1)
        expect(toast).toBeCalledTimes(1)
        expect(toast).toHaveBeenCalledWith('Välkommen tillbaka My Name!')
    })
    it('tests login not ok', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                errors: {
                    detail: 'Some error with login'
                }
            })
        )
        const store = useAuthStore()
        await store.login('myemail@email.com', 'mypassword')

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/login', {
            method: 'POST',
            body: JSON.stringify({
                email: 'myemail@email.com',
                password: 'mypassword'
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        expect(socket.emit).toBeCalledTimes(0)
        expect(loader.show).toBeCalledTimes(1)
        expect(loader.hide).toBeCalledTimes(1)
        expect(customAlert).toBeCalledTimes(1)
        expect(customAlert).toHaveBeenCalledWith('Some error with login')
    })
    it('tests register ok', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(createFetchResponse({}))
        const store = useAuthStore()
        store.login = vi.fn()
        await store.register('myemail@email.com', 'mypassword', 'My Name')

        expect(fetch).toHaveBeenCalledWith(
            'https://jsramverk-marjul2023.azurewebsites.net/register',
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'My Name',
                    email: 'myemail@email.com',
                    password: 'mypassword'
                }),
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        expect(loader.show).toBeCalledTimes(1)
        expect(loader.hide).toBeCalledTimes(0)
        expect(store.login).toBeCalledTimes(1)
    })
    it('tests register duplicate key not ok', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                errors: {
                    detail: 'Some error with duplicate key'
                }
            })
        )
        const store = useAuthStore()
        store.login = vi.fn()
        await store.register('myemail@email.com', 'mypassword', 'My Name')

        expect(fetch).toHaveBeenCalledWith(
            'https://jsramverk-marjul2023.azurewebsites.net/register',
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'My Name',
                    email: 'myemail@email.com',
                    password: 'mypassword'
                }),
                headers: {
                    // Authorization: `Bearer ${token}`,
                    // Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )
        expect(loader.show).toBeCalledTimes(1)
        expect(loader.hide).toBeCalledTimes(1)
        expect(customAlert).toBeCalledTimes(1)
        expect(customAlert).toHaveBeenCalledWith(
            'Det finns redan en användare med användarnamn myemail@email.com'
        )
        expect(store.login).toBeCalledTimes(0)
    })
    it('tests register other error not ok', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                errors: {
                    detail: 'Some other error with register'
                }
            })
        )
        const store = useAuthStore()
        store.login = vi.fn()
        await store.register('myemail@email.com', 'mypassword', 'My Name')

        expect(fetch).toHaveBeenCalledWith(
            'https://jsramverk-marjul2023.azurewebsites.net/register',
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'My Name',
                    email: 'myemail@email.com',
                    password: 'mypassword'
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        expect(loader.show).toBeCalledTimes(1)
        expect(loader.hide).toBeCalledTimes(1)
        expect(customAlert).toBeCalledTimes(1)
        expect(customAlert).toHaveBeenCalledWith('Något gick fel, försök igen om en stund')
        expect(store.login).toBeCalledTimes(0)
    })
    it('tests logout', async () => {
        const store = useAuthStore()
        store.token = 'iamatoken'
        expect(store.token).toBe('iamatoken')
        store.logout()
        expect(store.token).toBe('')
    })
    it('tests getToken', async () => {
        const store = useAuthStore()
        store.token = 'iamatoken'
        expect(store.getToken()).toBe('iamatoken')
    })
    it('tests isTokenValid Not Ok', async () => {
        const store = useAuthStore()
        store.token = 'iamatoken'
        expect(store.token).toBe('iamatoken')
        const result = {
            errors: [
                {
                    message: 'some token error'
                }
            ]
        }

        const res = store.isTokenValid(result)
        expect(res).toBe(false)
        expect(store.token).toBe('')
        expect(router.push).toHaveBeenCalledWith('/login')
        expect(customAlert).toHaveBeenCalledWith('some token error')
    })
    it('tests isTokenValid Ok', async () => {
        const store = useAuthStore()
        store.token = 'iamatoken'
        expect(store.token).toBe('iamatoken')
        const result = {}

        const res = store.isTokenValid(result)
        expect(res).toBe(true)
        expect(store.token).toBe('iamatoken')
        expect(router.push).toBeCalledTimes(0)
        expect(customAlert).toBeCalledTimes(0)
    })
    it('tests login not ok', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(
            createFetchResponse({
                errors: {
                    detail: 'Some error with login'
                }
            })
        )
        const store = useAuthStore()
        await store.login('myemail@email.com', 'mypassword')

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/login', {
            method: 'POST',
            body: JSON.stringify({
                email: 'myemail@email.com',
                password: 'mypassword'
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        expect(socket.emit).toBeCalledTimes(0)
        expect(loader.show).toBeCalledTimes(1)
        expect(loader.hide).toBeCalledTimes(1)
        expect(customAlert).toBeCalledTimes(1)
        expect(customAlert).toHaveBeenCalledWith('Some error with login')
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
