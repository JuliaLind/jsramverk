
import { vi, describe, it, expect, afterEach } from 'vitest'
import TicketForm from '../TicketForm.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { defineComponent } from 'vue'
import { codes } from './mockdata/codes.js'
import { currentItem } from './mockdata/current-item.js'


const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

vi.mock('@/stores/ticket', () => ({
    useTicketStore: () => ({
        currentItem: currentItem,
        getCurrent: () => {
            return currentItem
        }
    })
}))

vi.mock('../../services/api.service.js', () => {
    return {
        getCodes: vi.fn(() => {
            return codes
        })
    }
})


describe('TicketForm', async () => {
    router.push('/tickets')
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const SuspenseWrapperComponent = defineComponent({
            components: { TicketForm },
            template: `
            <Suspense>
                <TicketForm />
            </Suspense> `
        })

        const suspenseWrapper = mount(SuspenseWrapperComponent, {
            global: {
                plugins: [router]
            }
        })

        await flushPromises()
        const wrapper = suspenseWrapper.findComponent({ name: 'TicketForm' })

        expect(wrapper.text()).contains('Nytt ärende #')
        expect(wrapper.text()).contains('Försenad: 10 minuter')
        expect(wrapper.text()).contains('Orsakskod')
        expect(wrapper.text()).contains('Bakre tåg')


        suspenseWrapper.unmount()

        // note to self: add test for clicking on the submitbutton and checking that submitNewTickets function is salled. Also add test for checking codes in options dropdown
    })
})
