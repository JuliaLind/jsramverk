import { vi, describe, it, expect, afterEach } from 'vitest'
import TicketTable from '../TicketTable.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { tickets } from './mockdata/tickets.js'
import { codes } from './mockdata/codes-small.js'
import { trainnumbers } from './mockdata/trainnumbers.js'

vi.mock('../../services/api.service.js', () => {
    return {
        getCodes: vi.fn(() => {
            return codes
        }),
        getTrainNumbers: vi.fn(() => {
            return trainnumbers
        })
    }
})

vi.mock('@/stores/auth', () => ({
    useAuthStore: () => ({
        token: 'imavalidtoken',
        getToken: vi.fn(() => {
            return 'imavalidtoken'
        }),
        updateTicket: () => {
            return 'ok'
        },
        deleteTicket: () => {
            return 'ok'
        },
        getTickets: vi.fn(() => {
            return tickets
        })
    })
}))

describe('TicketsTable', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const wrapper = mount(TicketTable)
        await flushPromises()
        expect(wrapper.text()).contains('Befintliga ärenden')
        expect(wrapper.text()).contains('Add new')
        expect(wrapper.text()).contains('Edit')
        expect(wrapper.text()).contains('Delete')
        // expect(wrapper.text()).contains('6505c49ab3546c7d65e58f89')
        // expect(wrapper.text()).contains('65071ede53fecc7e2c2c1732')
        wrapper.unmount()
    })
})
