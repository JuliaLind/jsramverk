import { beforeEach, vi, describe, it, expect, afterEach } from 'vitest'
import SingleTicket from '../SingleTicket.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { codes } from './mockdata/codes-small.js'
import { ticket } from './mockdata/ticket.js'
import { socketStore } from '@/stores/socket'
import { useAuthStore } from '@/stores/auth'
import { setActivePinia, createPinia } from 'pinia'


describe('SingleTicket', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    const updatedTicket = `
    mutation {
        updateTicket(_id: "651da2e90e521f4638c82312", code: "ANA004") {
            _id
            code
            trainnumber
        }
    }
    `

    it('renders properly', async () => {
        const auth = useAuthStore()
        auth.reasonCodes = codes
        auth.token = "imavalidtoken"
        const wrapper = mount(SingleTicket, {
            props: {
                ticket: ticket
            }
        })
        await flushPromises()
        expect(wrapper.text()).toContain("651da2e90e521f4638c82312")
        expect(wrapper.text()).toContain('ONA127')
        expect(wrapper.text()).toContain('10345')
        expect(wrapper.text()).contains('Ändra')
        expect(wrapper.text()).contains('Ta bort')
        wrapper.unmount()
    })
    it('test toggle edit', async () => {
        const auth = useAuthStore()
        auth.userEmail = "my@email.com"
        auth.reasonCodes = codes
        const socket = socketStore()
        socket.notifyBackendEdit = vi.fn()
        socket.notifyBackendStopEdit = vi.fn()
        const wrapper = mount(SingleTicket, {
            props: {
                ticket: ticket
            }
        })
        await flushPromises()
        await wrapper.find('button.btn-dark').trigger('click')
        expect(socket.notifyBackendEdit).toHaveBeenCalledWith({
            ticket: "651da2e90e521f4638c82312",
            user: "my@email.com"
        })
        expect(wrapper.text()).contains('Återgå')
        await wrapper.find('button.btn-dark').trigger('click')
        expect(socket.notifyBackendStopEdit).toHaveBeenCalledWith({
            ticket: "651da2e90e521f4638c82312"
        })
        expect(wrapper.text()).contains('Ändra')
        wrapper.unmount()
    })

    it('test update', async () => {
        const auth = useAuthStore()
        auth.userEmail = "my@email.com"
        auth.reasonCodes = codes
        auth.updateTicket = vi.fn()
        const socket = socketStore()
        socket.notifyBackendEdit = vi.fn()
        socket.notifyBackendStopEdit = vi.fn()
        const wrapper = mount(SingleTicket, {
            props: {
                ticket: ticket
            }
        })
        await flushPromises()
        await wrapper.find('button.btn-dark').trigger('click')
        expect(socket.notifyBackendEdit).toHaveBeenCalledWith({
            ticket: "651da2e90e521f4638c82312",
            user: "my@email.com"
        })
        await wrapper.find('select').setValue('ANA004')
        await wrapper.find('input.btn-success').trigger('click')
        expect(socket.notifyBackendStopEdit).toHaveBeenCalledTimes(0)
        expect(auth.updateTicket).toHaveBeenCalledWith(updatedTicket)
        expect(wrapper.text()).contains('Ändra')
        wrapper.unmount()
    })
})
