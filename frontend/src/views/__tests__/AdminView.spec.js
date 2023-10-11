import { vi, describe, it, expect, afterEach } from 'vitest'
import AdminView from '../AdminView.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { tickets } from '../../components/__tests__/mockdata/tickets.js'
import { codes } from '../../components/__tests__/mockdata/codes-small.js'
import { trainnumbers } from '../../components/__tests__/mockdata/trainnumbers.js'

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

vi.mock('@/stores/socket', () => ({
    socketStore: () => ({
        data: {
            '6505d0b1a60773cde6d0704d': 'user@email.com'
        },
        notifyBackendEdit(data) {
            console.log(data)
        },
        notifyBackendStopEdit(data) {
            console.log(data)
        },
        listenForTicketLock() {
            //do nothing
        },
        listenForTicketUnlock() {
            //do nothing
        }
    })
}))

describe('AdminView', async () => {
    router.push('/admin')
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
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

        const wrapper = mount(AdminView, {
            global: {
                plugins: [router]
            }
        })

        await flushPromises()
        expect(wrapper.text()).contains('Befintliga ärenden')
        // expect(wrapper.text()).contains('6505d0b1a60773cde6d0704d')

        wrapper.unmount()
    })
})
