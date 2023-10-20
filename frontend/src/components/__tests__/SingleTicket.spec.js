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
        // check the Save button has not been rendered before user clicks Edit
        expect(wrapper.html()).not.toContain('Spara')

        // click on the edit button
        await wrapper.find('button.btn-dark').trigger('click')

        // make sure socket emitted message to backend that other users should
        // lock the ticket for editing/deleting
        expect(socket.notifyBackendEdit).toHaveBeenCalledWith({
            ticket: '651da2e90e521f4638c82312',
            user: 'my@email.com'
        })

        // check that the Save button is now present
        expect(wrapper.html()).contains('Spara')

        // chek that the Edit button changed innerText to Return
        expect(wrapper.html()).contains('Återgå')
        expect(wrapper.html()).not.contains('Ändra')


        // click the return button and check that socket
        // emits message go backend so other users can unlock the ticket
        await wrapper.find('button.btn-dark').trigger('click')
        expect(socket.notifyBackendStopEdit).toHaveBeenCalledWith({
            ticket: '651da2e90e521f4638c82312'
        })

        // make sure that the buttons are restored to initial values
        expect(wrapper.text()).contains('Ändra')
        expect(wrapper.html()).not.contains('Spara')
        expect(wrapper.html()).not.contains('Återgå')
        wrapper.unmount()
    })

    it('test update a ticket', async () => {
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
        // click the edit button
        await wrapper.find('button.btn-dark').trigger('click')

        // check that backend is notified to inform other users
        // to lock the ticket for editing/deleting
        expect(socket.notifyBackendEdit).toHaveBeenCalledWith({
            ticket: '651da2e90e521f4638c82312',
            user: 'my@email.com'
        })

        // select a different reasoncode
        await wrapper.find('select').setValue('ANA004')

        // save the change
        await wrapper.find('input.btn-success').trigger('click')

        // make sure that correct emit is sent to backend (updateticket
        // will also trigger backend to send unlock emit to other users)
        expect(socket.notifyBackendStopEdit).toHaveBeenCalledTimes(0)

        // check that the emit included correct ticket data
        expect(auth.updateTicket).toHaveBeenCalledWith(updatedTicket)

        // check that the tickt component has returned from edit state to
        // "ordinary" state
        expect(wrapper.text()).contains('Ändra')
        wrapper.unmount()
    })

    it('test delete a ticket', async () => {
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
        // click the delete button
        await wrapper.find('button.btn-danger').trigger('click')
        expect(socket.notifyBackendEdit).toHaveBeenCalledTimes(0)
        // check that deleteTicket method was called with correct parameter
        // thorugh deleteTicket method socket will send a refresh emit to backend/
        // other users
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

        // find efit and delete buttons and make sure they are not disabled in
        // the initial state
        let deleteBtn = wrapper.find('button.btn-danger')
        let editBtn = wrapper.find('button.btn-dark')
        expect(deleteBtn.html()).not.contains('disabled')
        expect(editBtn.html()).not.contains('disabled')

        // add ticket id to the associative array
        // containing tickets that should be locked for editing
        socket.data['651da2e90e521f4638c82312'] = 'someuser@email.com'

        // find the delete and edit buttons again and make sure that they
        // have been disabled
        deleteBtn = await wrapper.find('button.btn-danger')
        editBtn = await wrapper.find('button.btn-dark')
        expect(deleteBtn.html()).contains('disabled')
        expect(editBtn.html()).contains('disabled')

        // empty the array with locked tickets and make sure
        // the buttons are enabled again
        socket.data = {};
        deleteBtn = await wrapper.find('button.btn-danger')
        editBtn = await wrapper.find('button.btn-dark')
        expect(deleteBtn.html()).not.contains('disabled')
        expect(editBtn.html()).not.contains('disabled')
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
        // find buttons and make sure they are not disabled
        let deleteBtn = await wrapper.find('button.btn-danger')
        let editBtn = await wrapper.find('button.btn-dark')
        expect(deleteBtn.html()).not.toContain('disabled')
        expect(editBtn.html()).not.toContain('disabled')

        // save a different ticket in array with locked tickets
        socket.data['651da2e90e521f4658c82312'] = 'someuser@email.com'

        // find the buttons again and make sure they have not been affected
        deleteBtn = await wrapper.find('button.btn-danger')
        editBtn = await wrapper.find('button.btn-dark')
        expect(deleteBtn.html()).not.contains('disabled')
        expect(editBtn.html()).not.contains('disabled')
        wrapper.unmount()
    })
})
