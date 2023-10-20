import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import AdminView from '../AdminView.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { tickets } from '../../components/__tests__/mockdata/tickets.js'
import { codes } from '../../components/__tests__/mockdata/codes-small.js'
import { trainnumbers } from '../../components/__tests__/mockdata/trainnumbers.js'

import { setActivePinia, createPinia } from 'pinia'

import { socketStore } from '@/stores/socket'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

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

describe('AdminView', async () => {
    beforeEach(async () => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const socket = socketStore()
        socket.data = {
            '6505d0b1a60773cde6d0704d': 'user@email.com'
        }
        const auth = useAuthStore()
        auth.getTickets(() => {
            return tickets
        })
        auth.logout = vi.fn()

        const wrapper = mount(AdminView, {
            global: {
                plugins: [router]
            }
        })

        await flushPromises()
        expect(wrapper.text()).contains('Befintliga ärenden')
        await wrapper.find('.btn-warning').trigger('click')
        expect(auth.logout).toHaveBeenCalledOnce()
        wrapper.unmount()
    })
})
