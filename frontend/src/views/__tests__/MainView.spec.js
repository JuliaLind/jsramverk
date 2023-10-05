import { vi, describe, it, expect, afterEach } from 'vitest'
import MainView from '../MainView.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { delayed } from '../../components/__tests__/mockdata/delayed.js'

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
    vi.mock('@/stores/trains', () => ({
        useTrainsStore: () => ({
            current: "",
            setCurrent: () => {
                // do nothing
            },
        })
    }))
    router.push('/')
    await router.isReady()

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


        expect(wrapper.text()).contains('8150')
        expect(wrapper.text()).contains('RvBlgc ->  Mras')
        expect(wrapper.text()).contains('KpHpbg ->  Vå')

        wrapper.unmount()
        // suspenseWrapper.unmount()
    })
})
