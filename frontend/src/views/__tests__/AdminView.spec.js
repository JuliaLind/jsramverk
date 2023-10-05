import { vi, describe, it, expect, afterEach } from 'vitest'
import AdminView from '../AdminView.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
// import { defineComponent } from 'vue'
import { codes } from '../../components/__tests__/mockdata/codes.js'
import { tickets } from '../../components/__tests__/mockdata/tickets.js'
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

describe('AdminView', async () => {
    router.push('/admin')
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    // it('renders properly', async () => {
    //     vi.mock('@/stores/auth', () => ({
    //         useAuthStore: () => ({
    //             token: "imavalidtoken",
    //             getToken: vi.fn(() => {
    //                 return "imavalidtoken"
    //             }),
    //             updateTicket: () => {
    //                 return "ok"
    //             },
    //             deleteTicket: () => {
    //                 return "ok"
    //             },
    //             getTickets: vi.fn(() => {
    //                 // console.log(tickets);
    //                 return tickets
    //             }),
    //         })
    //     }))
    //     const SuspenseWrapperComponent = defineComponent({
    //         components: { AdminView },
    //         template: `
    //         <Suspense>
    //             <AdminView />
    //         </Suspense> `
    //     })

    //     await flushPromises()
    //     const suspenseWrapper = mount(SuspenseWrapperComponent, {
    //         global: {
    //             plugins: [router]
    //         }
    //     })

    //     await flushPromises()
    //     const wrapper = suspenseWrapper.findComponent({ name: 'AdminView' })
    //     expect(wrapper.text()).contains('Befintliga ärenden')
    //     // expect(wrapper.text()).contains('6505d0b1a60773cde6d0704d')

    //     suspenseWrapper.unmount()
    // })

    it('renders properly', async () => {
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
