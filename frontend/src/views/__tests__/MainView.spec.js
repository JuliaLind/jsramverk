import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import MainView from '../MainView.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { delayed } from '../../components/__tests__/mockdata/delayed.js'
import { setActivePinia, createPinia } from 'pinia'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

vi.mock('../../services/api.service.js', () => {
    return {
        getDelayedTrains: vi.fn(() => {
            return delayed
        })
    }
})

describe('MainView', async () => {
    router.push('/')
    await router.isReady()
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const wrapper = mount(MainView, {
            global: {
                plugins: [router],
                stubs: {
                    MapComp: {
                        template: '<span />'
                    }
                }
            }
        })
        await flushPromises()

        expect(wrapper.html()).contains('8136')
        expect(wrapper.text()).contains('Borlänge C')
        expect(wrapper.text()).contains('Kimstad')

        wrapper.unmount()
    })
})
