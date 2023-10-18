import { beforeEach, vi, describe, it, expect, afterEach } from 'vitest'
import NewTicket from '../NewTicket.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { codes } from './mockdata/codes-small.js'
import { trainnumbers } from './mockdata/trainnumbers.js'
import { useAuthStore } from '@/stores/auth'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('../../services/api.service.js', () => {
    return {
        getTrainNumbers: vi.fn(() => {
            return trainnumbers
        })
    }
})

const traindate = new Date().toJSON().slice(0, 10)

describe('NewTicket', async () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    const newTicket = `
        mutation {
            createTicket(code: "PNA099", trainnumber: "8468", traindate: "${traindate}") {
                _id
                code
            }
        }
    `

    it('renders properly', async () => {
        const auth = useAuthStore()
        auth.reasonCodes = codes
        auth.token = 'imavalidtoken'

        const wrapper = mount(NewTicket)

        await flushPromises()
        expect(wrapper.html()).toContain('Skapa')

        wrapper.unmount()
    })

    it('test submit new ticket', async () => {
        const auth = useAuthStore()
        auth.reasonCodes = codes
        auth.submitNewTicket = vi.fn()

        const wrapper = mount(NewTicket)
        await flushPromises()
        await wrapper.find('select[name=trainnumber]').setValue('8468')
        await wrapper.find('select[name=reasoncode]').setValue('PNA099')
        await wrapper.find('form').trigger('submit')
        expect(auth.submitNewTicket).toHaveBeenCalledWith(newTicket)
        wrapper.unmount()
    })
})
