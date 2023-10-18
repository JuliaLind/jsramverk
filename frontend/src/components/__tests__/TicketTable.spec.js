import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import TicketTable from '../TicketTable.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { tickets } from './mockdata/tickets.js'
import { codes } from './mockdata/codes-small.js'
import { trainnumbers } from './mockdata/trainnumbers.js'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

vi.mock('../../services/api.service.js', () => {
    return {
        getTrainNumbers: vi.fn(() => {
            return trainnumbers
        })
    }
})

describe('TicketsTable', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('renders properly', async () => {
        const store = useAuthStore()
        store.getTickets = vi.fn(() => {
            return tickets
        })
        store.codes = codes;
        const wrapper = mount(TicketTable)
        await flushPromises()
        expect(wrapper.text()).contains('Befintliga ärenden')
        expect(wrapper.text()).contains('Ärendenummer')
        expect(wrapper.html()).toContain('Skapa')
        expect(wrapper.html()).toContain('Ändra')
        expect(wrapper.text()).contains('Ta bort')
        expect(wrapper.html()).contains('6505c49ab3546c7d65e58f89')
        expect(wrapper.html()).contains('65071ede53fecc7e2c2c1732')
        wrapper.unmount()
    })
})
