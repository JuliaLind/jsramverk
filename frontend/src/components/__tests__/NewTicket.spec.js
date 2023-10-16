import { vi, describe, it, expect, afterEach } from 'vitest'
import NewTicket from '../NewTicket.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { codes } from './mockdata/codes-small.js'
import { trainnumbers } from './mockdata/trainnumbers.js'

vi.mock('@/stores/auth', () => ({
    useAuthStore: () => ({
        token: 'imavalidtoken',
        reasonCodes: codes,
        getToken: () => {
            return this.token
        }
    })
}))

vi.mock('../../services/api.service.js', () => {
    return {
        // getCodes: vi.fn(() => {
        //     return codes
        // }),
        getTrainNumbers: vi.fn(() => {
            return trainnumbers
        })
    }
})

describe('NewTicket', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const wrapper = mount(NewTicket)

        await flushPromises()
        expect(wrapper.html()).toContain('Skapa')

        wrapper.unmount()

        // note to self: add test for clicking on the submitbutton and checking that submitNewTickets function is called. Also add test for checking codes in options dropdown
    })
})
