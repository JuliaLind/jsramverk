import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import HeaderComp from '../HeaderComp.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { setActivePinia, createPinia } from 'pinia'
import { useTrainsStore } from '@/stores/trains'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

describe('HeaderComp', async () => {
    router.push('/login')
    await router.isReady()

    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    it('renders properly and click on the links resets store.current', async () => {
        const trains = useTrainsStore()

        const wrapper = mount(HeaderComp, {
            global: {
                plugins: [router]
            }
        })

        await flushPromises()
        expect(wrapper.text()).contains('Start')
        expect(wrapper.text()).contains('Admin')

        // set current trainnumber
        trains.setCurrent('5136')
        // doublecheck that it is actually set
        expect(trains.current).toBe('5136')
        // click on the main link
        await wrapper.find('a[href="/"]').trigger('click')
        // make sure that the previously set trainumber has been unset
        expect(trains.current).toBe('')
        // make sure that the refresh-map event is emitted
        expect(wrapper.emitted('refresh-map')).toBeTruthy()

        // set current trainnumber
        trains.setCurrent('3146')
        // doublecheck that it is actually set
        expect(trains.current).toBe('3146')
        // click on the admin link
        await wrapper.find('a[href="/admin"]').trigger('click')
        // make sure that the previously set trainumber has been unset
        expect(trains.current).toBe('')
        // make sure that the refresh-map event is emitted
        expect(wrapper.emitted('refresh-map')).toBeTruthy()

        wrapper.unmount()
    })
})
