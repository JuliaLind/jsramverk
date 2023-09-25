
import { vi, describe, it, expect, afterEach } from 'vitest'
import TicketTable from '../TicketTable.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { tickets } from './mockdata/tickets.js'

vi.mock('../../services/api.service.js', () => {
    return {
        getTickets: vi.fn(() => {
            return tickets
        })
    }
})


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
        expect(wrapper.text()).contains('6505d0b1a60773cde6d0704d - ANA004 - 34312 - 2023-09-16')
        suspenseWrapper.unmount()
    })
})
