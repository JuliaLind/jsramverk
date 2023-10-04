import { vi, describe, it, expect, afterEach } from 'vitest'
import SingleTicket from '../SingleTicket.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { defineComponent } from 'vue'
import { codes } from './mockdata/codes-small.js'
import { trainnumbers } from './mockdata/trainnumbers.js'
// import { ticket } from './mockdata/ticket.js'
// import { ticketItem } from './mockdata/ticket-item.js'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

vi.mock('@/stores/auth', () => ({
    useAuthStore: () => ({
        token: "imavalidtoken",
        getToken: () => {
            return this.token
        },
        updateTicket: () => {
            return "ok"
        },
        deleteTicket: () => {
            return "ok"
        }
    })
}))


// vi.mock('../../services/api.service.js', () => {
//     return {
//         getCodes: vi.fn(() => {
//             return codes
//         }),
//         getDelayed: vi.fn(() => {
//             return delayed
//         })
//     }
// })





describe('SingleTicket', async () => {
    router.push('/admin')
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })
    const ticket = {
        _id: "651da2e90e521f4638c82312",
        code: "ONA127",
        trainnumber: "10345",
        traindate: "2023-10-04"
    }
    

    it('renders properly', async () => {
        const SuspenseWrapperComponent = defineComponent({
            components: { SingleTicket },
            template: `
            <Suspense>
                <SingleTicket :codes="codes" :trainnumbers="trainnumbers" :ticket="ticket" />
            </Suspense> `,
            props: {
                ticket: Object,
                codes: Array,
                trainnumbers: Array
            }
        })

        const suspenseWrapper = mount(SuspenseWrapperComponent,
            {
                props: {
                    codes: codes,
                    trainnumbers: trainnumbers,
                    ticket: ticket
                },
                global: {
                    plugins: [router]
            }
        })


        await flushPromises()
        const wrapper = suspenseWrapper.findComponent({ name: 'SingleTicket' })


        expect(wrapper.text()).contains('ONA127')
        expect(wrapper.text()).contains('10345')
        expect(wrapper.text()).contains('Edit')
        expect(wrapper.text()).contains('Delete')
        suspenseWrapper.unmount()

        // note to self: add test for clicking on the submitbutton and checking that submitSingleTickets function is salled. Also add test for checking codes in options dropdown
    })
})
