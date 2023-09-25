
import { vi, describe, it, expect, afterEach } from 'vitest'
import DelayedTable from '../DelayedTable.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { defineComponent } from 'vue'
import { delayed } from './mockdata/delayed.js'


const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

vi.mock('@/stores/ticket', () => ({
    useTicketStore: () => ({
        currentItem: {}
    })
}))

vi.mock('../../services/api.service.js', () => {
    return {
        getDelayedTrains: vi.fn(() => {
            return delayed
        })
    }
})


describe('DelayedTable', async () => {
    router.push('/')
    // After this line, router is ready
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        // Create suspense wrapper for the tested component
        const SuspenseWrapperComponent = defineComponent({
            components: { DelayedTable },
            template: `
            <Suspense>
                <DelayedTable />
            </Suspense> `
        })

        const suspenseWrapper = mount(SuspenseWrapperComponent, {
            global: {
                plugins: [router]
            }
        })
        // Wait suspense promise
        await flushPromises()

        // Access the tested component
        const wrapper = suspenseWrapper.findComponent({ name: 'DelayedTable' })

        expect(wrapper.text()).contains('8150')
        expect(wrapper.text()).contains('RvBlgc ->  Mras')
        expect(wrapper.text()).contains('KpHpbg ->  Vå')

        suspenseWrapper.unmount()
    })
})
