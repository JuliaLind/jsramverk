import { vi, describe, it, expect, afterEach } from 'vitest'
import TicketTable from '../TicketTable.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { tickets } from './mockdata/tickets.js'
import { codes } from './mockdata/codes-small.js'
import { delayed } from './mockdata/delayed.js'

vi.mock('../../services/api.service.js', () => {
    return {
        getCodes: vi.fn(() => {
            return codes
        }),
        getDelayedTrains: vi.fn(() => {
            return delayed
        })
    }
})

vi.mock('@/stores/auth', () => ({
    useAuthStore: () => ({
        token: "imavalidtoken",
        getToken: vi.fn(() => {
            return "imavalidtoken"
        }),
        updateTicket: () => {
            return "ok"
        },
        deleteTicket: () => {
            return "ok"
        },
        getTickets: vi.fn(() => {
            return tickets
        }),
    })
}))

describe('TicketsTable', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const SuspenseWrapperComponent = defineComponent({
            components: { TicketTable },
            template: `
            <Suspense>
                <TicketTable />
            </Suspense> `
        })

        const suspenseWrapper = mount(SuspenseWrapperComponent)

        await flushPromises()

        const wrapper = suspenseWrapper.findComponent({ name: 'TicketTable' })
        expect(wrapper.text()).contains('Befintliga ärenden')
        expect(wrapper.text()).contains('Add new')
        expect(wrapper.text()).contains('Edit')
        expect(wrapper.text()).contains('Delete')
        // expect(wrapper.text()).contains('6505c49ab3546c7d65e58f89')
        // expect(wrapper.text()).contains('65071ede53fecc7e2c2c1732')
        suspenseWrapper.unmount()
    })
})
