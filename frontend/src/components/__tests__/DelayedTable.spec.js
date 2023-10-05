import { vi, describe, it, expect, afterEach } from 'vitest'
import DelayedTable from '../DelayedTable.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { delayed } from './mockdata/delayed.js'


vi.mock('../../services/api.service.js', () => {
    return {
        getDelayedTrains: vi.fn(() => {
            return delayed
        })
    }
})

describe('DelayedTable', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        vi.mock('@/stores/trains', () => ({
            useTrainsStore: () => ({
                current: "",
                setCurrent: () => {
                    // do nothing
                },
            })
        }))


        const wrapper = mount(DelayedTable)

        await flushPromises()

        expect(wrapper.text()).contains('8150')
        expect(wrapper.text()).contains('RvBlgc ->  Mras')
        expect(wrapper.text()).contains('KpHpbg ->  Vå')

        wrapper.unmount()

        // note to self: add test for clicking on a DelayedItem
    })
})
