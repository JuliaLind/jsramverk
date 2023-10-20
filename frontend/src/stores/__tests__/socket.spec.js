import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import socket from '../../services/socket.service.js'
import { socketStore } from '@/stores/socket'

socket.emit = vi.fn()
socket.on = vi.fn()

describe('socket store part 1', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('tests notifyBackendEdit', () => {
        const store = socketStore()
        store.notifyBackendEdit({
            ticket: '651da2e90e521f4638c82312',
            user: 'my@email.com'
        })
        expect(socket.emit).toBeCalledTimes(1)
        expect(socket.emit).toHaveBeenCalledWith('edit-ticket', {
            ticket: '651da2e90e521f4638c82312',
            user: 'my@email.com'
        })
    })

    it('tests notifyBackendStopEdit', () => {
        const store = socketStore()
        store.notifyBackendStopEdit({
            ticket: '651da2e90e521f4638c82312'
        })
        expect(socket.emit).toBeCalledTimes(1)
        expect(socket.emit).toHaveBeenCalledWith('stop-edit', {
            ticket: '651da2e90e521f4638c82312'
        })
    })
})
