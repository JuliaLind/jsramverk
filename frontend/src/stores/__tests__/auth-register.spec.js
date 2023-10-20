import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import socket from '../../services/socket.service.js'
import { loader } from '../../services/loader.service.js'
import { customAlert } from '../../services/alert.service.js'
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
})
