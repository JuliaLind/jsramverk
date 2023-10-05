import { vi, describe, it, expect, afterEach } from 'vitest'
import NewTicket from '../NewTicket.vue'
import { mount } from '@vue/test-utils'
import { codes } from './mockdata/codes-small.js'
import { trainnumbers } from './mockdata/trainnumbers.js'

vi.mock('@/stores/auth', () => ({
    useAuthStore: () => ({
        token: "imavalidtoken",
        getToken: () => {
            return this.token
        },
    })
}))


describe('NewTicket', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const wrapper = mount(NewTicket,
            {
                props: {
                    codes: codes,
                    trainnumbers: trainnumbers
                },
            }
        )

        expect(wrapper.text()).contains('ANA002')
        expect(wrapper.text()).contains('8150')

        wrapper.unmount()

        // note to self: add test for clicking on the submitbutton and checking that submitNewTickets function is salled. Also add test for checking codes in options dropdown
    })
})
