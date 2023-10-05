import { vi, describe, it, expect, afterEach } from 'vitest'
import SingleTicket from '../SingleTicket.vue'
import { mount } from '@vue/test-utils'
import { codes } from './mockdata/codes-small.js'
import { trainnumbers } from './mockdata/trainnumbers.js'



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



describe('SingleTicket', async () => {
    // router.push('/admin')
    // await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const ticket = {
            _id: "651da2e90e521f4638c82312",
            code: "ONA127",
            trainnumber: "10345",
            traindate: "2023-10-04"
        }
        const wrapper = mount(SingleTicket,
            {
                props: {
                    codes: codes,
                    trainnumbers: trainnumbers,
                    ticket: ticket
                },
        })


        expect(wrapper.text()).contains('ONA127')
        expect(wrapper.text()).contains('10345')
        expect(wrapper.text()).contains('Edit')
        expect(wrapper.text()).contains('Delete')
        // note for later: find out how to access ticket number field
        // expect(wrapper.text()).contains("651da2e90e521f4638c82312")
        wrapper.unmount()

        // note to self: add test for clicking on the submitbutton and checking that submitSingleTickets function is salled. Also add test for checking codes in options dropdown
    })
})
