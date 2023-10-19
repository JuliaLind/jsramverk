import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import socket from '../../services/socket.service.js'
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

describe('auth-store', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
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
