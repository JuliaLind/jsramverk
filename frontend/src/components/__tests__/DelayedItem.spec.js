import { vi, describe, it, expect } from 'vitest'
import DelayedItem from '../DelayedItem.vue'
import { mount } from '@vue/test-utils'
import { currentItem } from './mockdata/current-item.js'


describe('DelayedItem', async () => {
    it('renders properly', () => {
        vi.mock('@/stores/trains', () => ({
            useTrainsStore: () => ({
                current: '',
                setCurrent: () => {
                    // do nothing
                }
            })
        }))
        const wrapper = mount(DelayedItem, {
            props: {
                item: currentItem
            }
        })
        expect(wrapper.text()).toContain('8483')
        expect(wrapper.text()).toContain('Djurås')
        expect(wrapper.text()).toContain('Borlänge C')
        expect(wrapper.text()).toContain('Morastrand')

        wrapper.unmount()
    })
})
