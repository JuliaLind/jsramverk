import { vi, describe, it, expect, afterEach } from 'vitest'
import DelayedTable from '../DelayedTable.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { delayed } from './mockdata/delayed.js'
import { getDelayedTrains } from '../../services/api.service.js'




describe('DelayedTable', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        vi.mock('../../services/api.service.js', () => {
            return {
                getDelayedTrains: vi.fn(() => {
                    return delayed
                })
            }
        })
        vi.mock('@/stores/trains', () => ({
            useTrainsStore: () => ({
                current: '',
                setCurrent: () => {
                    // do nothing
                }
            })
        }))
        const wrapper = mount(DelayedTable)

        await flushPromises()
        expect(getDelayedTrains).toBeCalledTimes(1)
        expect(wrapper.html()).toContain('8136')

        wrapper.unmount()

        // note to self: add test for clicking on a DelayedItem
    })
})
