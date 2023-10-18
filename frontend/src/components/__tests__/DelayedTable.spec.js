import { beforeEach, vi, describe, it, expect, afterEach } from 'vitest'
import DelayedTable from '../DelayedTable.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { delayed } from './mockdata/delayed.js'
import { getDelayedTrains } from '../../services/api.service.js'
import { useTrainsStore } from '@/stores/trains'
import { setActivePinia, createPinia } from 'pinia'

describe('DelayedTable', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    vi.mock('../../services/api.service.js', () => {
        return {
            getDelayedTrains: vi.fn(() => {
                return delayed
            })
        }
    })

    it('renders properly', async () => {
        const store = useTrainsStore()
        const wrapper = mount(DelayedTable)

        await flushPromises()
        expect(getDelayedTrains).toBeCalledTimes(1)
        expect(wrapper.html()).toContain('8136')
        expect(store.current).toBe('')
        wrapper.unmount()
    })
    it('tests toggle between showing one train or all trains', async () => {
        const store = useTrainsStore()
        const wrapper = mount(DelayedTable)

        await flushPromises()
        expect(getDelayedTrains).toBeCalledTimes(1)
        expect(wrapper.html()).toContain('8136')
        expect(wrapper.html()).toContain('8739')
        expect(wrapper.html()).toContain('20096')
        expect(store.current).toBe('')

        await wrapper.find('.delay-item').trigger('click')
        expect(store.current).toBe('8136')
        expect(wrapper.html()).toContain('8136')
        expect(wrapper.html()).not.toContain('8739')
        expect(wrapper.html()).not.toContain('20096')
        await wrapper.find('.delay-item').trigger('click')
        expect(store.current).toBe('')
        expect(wrapper.html()).toContain('8739')
        expect(wrapper.html()).toContain('8136')
        expect(wrapper.html()).toContain('20096')
        wrapper.unmount()
    })
})
