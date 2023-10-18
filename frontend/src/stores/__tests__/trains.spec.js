import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTrainsStore } from '@/stores/trains'

describe('trains-store', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('tests that current item is toggled', async () => {
        const store = useTrainsStore()
        expect(store.current).toBe('')
        store.setCurrent('12345')
        expect(store.current).toBe('12345')
        store.setCurrent('12345')
        expect(store.current).toBe('')
    })
})
