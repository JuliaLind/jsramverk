import { vi, describe, it, expect, afterEach } from 'vitest'
import SingleTicket from '../SingleTicket.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { codes } from './mockdata/codes-small.js'
import { ticket } from './mockdata/ticket.js'

vi.mock('@/stores/auth', () => ({
    useAuthStore: () => ({
        token: 'imavalidtoken',
        getToken: () => {
            return this.token
        },
        updateTicket: () => {
            return 'ok'
        },
        deleteTicket: () => {
            return 'ok'
        }
    })
}))

vi.mock('@/stores/socket', () => ({
    socketStore: () => ({
        data: {
            "6505d0b1a60773cde6d0704d": "user@email.com"
        },
        notifyBackendEdit(data) {
            //do nothing
        },
        notifyBackendStopEdit(data) {
            //do nothing
        },
        listenForTicketLock() {
            //do nothing
        },
        listenForTicketUnlock() {
            //do nothing
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

describe('SingleTicket', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const wrapper = mount(SingleTicket, {
            props: {
                ticket: ticket
            }
        })
        await flushPromises()
        expect(wrapper.text()).toContain('ONA127')
        // expect(wrapper.text()).toContain('10345')
        expect(wrapper.text()).contains('Ändra')
        expect(wrapper.text()).contains('Ta bort')
        // note for later: find out how to access ticket number field
        // expect(wrapper.text()).toContain("651da2e90e521f4638c82312")
        wrapper.unmount()

        // note to self: add test for clicking on the submitbutton and checking that submitSingleTickets function is salled. Also add test for checking codes in options dropdown
    })
})
