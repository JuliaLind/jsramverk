import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import DelayedItem from '../DelayedItem.vue'
import { mount } from '@vue/test-utils'
import { currentItem } from './mockdata/current-item.js'
import { useTrainsStore } from '@/stores/trains'
import { setActivePinia, createPinia } from 'pinia'

describe('DelayedItem', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    it('renders properly', () => {
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
    it('renders properly if store.current is this items trainnumber', () => {
        const trains = useTrainsStore()
        trains.setCurrent('8483')
        const wrapper = mount(DelayedItem, {
            props: {
                item: currentItem
            }
        })
        // make sure the delayed item is displayed if current is set to the item's trainnumber
        expect(wrapper.text()).toContain('8483')
        expect(wrapper.text()).toContain('Djurås')
        expect(wrapper.text()).toContain('Borlänge C')
        expect(wrapper.text()).toContain('Morastrand')

        wrapper.unmount()
    })
    it('renders properly if store.current is not this items trainnumber', () => {
        const trains = useTrainsStore()
        trains.setCurrent('8485')
        const wrapper = mount(DelayedItem, {
            props: {
                item: currentItem
            }
        })
        // make sure that delayed item is not displayed if current train is
        // set to different trainnumber
        expect(wrapper.text()).not.toContain('8483')
        expect(wrapper.text()).not.toContain('Djurås')
        expect(wrapper.text()).not.toContain('Borlänge C')
        expect(wrapper.text()).not.toContain('Morastrand')

        wrapper.unmount()
    })
})
