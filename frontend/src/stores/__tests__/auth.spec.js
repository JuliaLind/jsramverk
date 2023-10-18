import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import socket from '../../services/socket.service.js'
import { loader } from '../../services/loader.service.js'
import { customAlert, toast } from '../../services/alert.service.js'
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
                // Authorization: `Bearer ${token}`,
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
        fetch.mockResolvedValue(
            createFetchResponse({})
        )
        const store = useAuthStore()
        store.login = vi.fn()
        await store.register('myemail@email.com', 'mypassword', "My Name")

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/register', {
            method: 'POST',
            body: JSON.stringify({
                name: "My Name",
                email: 'myemail@email.com',
                password: 'mypassword'
            }),
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
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
        await store.register('myemail@email.com', 'mypassword', "My Name")

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/register', {
            method: 'POST',
            body: JSON.stringify({
                name: "My Name",
                email: 'myemail@email.com',
                password: 'mypassword'
            }),
            headers: {
                // Authorization: `Bearer ${token}`,
                // Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        expect(loader.show).toBeCalledTimes(1)
        expect(loader.hide).toBeCalledTimes(1)
        expect(customAlert).toBeCalledTimes(1)
        expect(customAlert).toHaveBeenCalledWith('Det finns redan en användare med användarnamn myemail@email.com')
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
        await store.register('myemail@email.com', 'mypassword', "My Name")

        expect(fetch).toHaveBeenCalledWith('https://jsramverk-marjul2023.azurewebsites.net/register', {
            method: 'POST',
            body: JSON.stringify({
                name: "My Name",
                email: 'myemail@email.com',
                password: 'mypassword'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
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
})
