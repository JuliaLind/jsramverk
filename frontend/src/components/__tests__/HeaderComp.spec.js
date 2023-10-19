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

        trains.setCurrent('5136')
        expect(trains.current).toBe('5136')
        await wrapper.find('a[href="/"]').trigger('click')
        expect(trains.current).toBe('')
        expect(wrapper.emitted('refresh-map')).toBeTruthy()

        trains.setCurrent('3146')
        expect(trains.current).toBe('3146')
        await wrapper.find('a[href="/admin"]').trigger('click')
        expect(trains.current).toBe('')
        expect(wrapper.emitted('refresh-map')).toBeTruthy()

        wrapper.unmount()
    })
})
