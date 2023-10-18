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
    const deletedTicket = `
    mutation {
        deleteTicket(_id: "651da2e90e521f4638c82312") {
            _id
        }
    }
    `
    it('renders properly', async () => {
        const auth = useAuthStore()
        auth.reasonCodes = codes
        auth.token = 'imavalidtoken'
        const wrapper = mount(SingleTicket, {
            props: {
                ticket: ticket
            }
        })
        await flushPromises()
        expect(wrapper.text()).toContain('651da2e90e521f4638c82312')
        expect(wrapper.text()).toContain('ONA127')
        expect(wrapper.text()).toContain('10345')
        expect(wrapper.text()).contains('Ändra')
        expect(wrapper.text()).contains('Ta bort')
        wrapper.unmount()
    })
    it('test toggle edit', async () => {
        const auth = useAuthStore()
        auth.userEmail = 'my@email.com'
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
        expect(wrapper.html()).not.toContain('Spara')
        await wrapper.find('button.btn-dark').trigger('click')
        expect(socket.notifyBackendEdit).toHaveBeenCalledWith({
            ticket: '651da2e90e521f4638c82312',
            user: 'my@email.com'
        })
        expect(wrapper.html()).contains('Spara')
        expect(wrapper.html()).contains('Återgå')
        expect(wrapper.html()).not.contains('Ändra')
        await wrapper.find('button.btn-dark').trigger('click')
        expect(socket.notifyBackendStopEdit).toHaveBeenCalledWith({
            ticket: '651da2e90e521f4638c82312'
        })
        expect(wrapper.text()).contains('Ändra')
        expect(wrapper.html()).not.contains('Spara')
        expect(wrapper.html()).not.contains('Återgå')
        wrapper.unmount()
    })

    it('test update', async () => {
        const auth = useAuthStore()
        auth.userEmail = 'my@email.com'
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
            ticket: '651da2e90e521f4638c82312',
            user: 'my@email.com'
        })
        await wrapper.find('select').setValue('ANA004')
        await wrapper.find('input.btn-success').trigger('click')
        expect(socket.notifyBackendStopEdit).toHaveBeenCalledTimes(0)
        expect(auth.updateTicket).toHaveBeenCalledWith(updatedTicket)
        expect(wrapper.text()).contains('Ändra')
        wrapper.unmount()
    })

    it('test delete', async () => {
        const auth = useAuthStore()
        auth.reasonCodes = codes
        auth.deleteTicket = vi.fn()
        const socket = socketStore()
        socket.notifyBackendEdit = vi.fn()
        const wrapper = mount(SingleTicket, {
            props: {
                ticket: ticket
            }
        })
        await flushPromises()
        await wrapper.find('button.btn-danger').trigger('click')
        expect(socket.notifyBackendEdit).toHaveBeenCalledTimes(0)
        expect(auth.deleteTicket).toHaveBeenCalledWith(deletedTicket)
        wrapper.unmount()
    })

    it('test disabled buttons', async () => {
        const auth = useAuthStore()
        auth.reasonCodes = codes
        auth.deleteTicket = vi.fn()
        const socket = socketStore()
        socket.notifyBackendEdit = vi.fn()
        const wrapper = mount(SingleTicket, {
            props: {
                ticket: ticket
            }
        })
        await flushPromises()
        let deleteBtn = await wrapper.find('button.btn-danger')
        let editBtn = await wrapper.find('button.btn-dark')
        expect(deleteBtn.html()).not.contains('disabled')
        expect(editBtn.html()).not.contains('disabled')
        socket.data['651da2e90e521f4638c82312']
            = "someuser@email.com"
        deleteBtn = await wrapper.find('button.btn-danger')
        editBtn = await wrapper.find('button.btn-dark')
        expect(deleteBtn.html()).contains('disabled')
        expect(editBtn.html()).contains('disabled')
        wrapper.unmount()
    })

    it('test not disabled buttons if different ticket nr in socket store', async () => {
        const auth = useAuthStore()
        auth.reasonCodes = codes
        auth.deleteTicket = vi.fn()
        const socket = socketStore()
        socket.notifyBackendEdit = vi.fn()
        const wrapper = mount(SingleTicket, {
            props: {
                ticket: ticket
            }
        })
        await flushPromises()
        let deleteBtn = await wrapper.find('button.btn-danger')
        let editBtn = await wrapper.find('button.btn-dark')
        expect(deleteBtn.html()).not.toContain('disabled')
        expect(editBtn.html()).not.toContain('disabled')
        socket.data['651da2e90e521f4658c82312']
            = "someuser@email.com"
        deleteBtn = await wrapper.find('button.btn-danger')
        editBtn = await wrapper.find('button.btn-dark')
        expect(deleteBtn.html()).not.contains('disabled')
        expect(editBtn.html()).not.contains('disabled')
        wrapper.unmount()
    })
})
