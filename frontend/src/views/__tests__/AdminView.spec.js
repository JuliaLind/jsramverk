import { vi, describe, it, expect, afterEach } from 'vitest'
import AdminView from '../AdminView.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { defineComponent } from 'vue'
import { codes } from '../../components/__tests__/mockdata/codes.js'
// import { currentItem } from '../../components/__tests__/mockdata/current-item.js'
import { tickets } from '../../components/__tests__/mockdata/tickets.js'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

// vi.mock('@/stores/ticket', () => ({
//     useTicketStore: () => ({
//         currentItem: {},
//         getCurrent: () => {
//             return currentItem
//         }
//     })
// }))

vi.mock('../../services/api.service.js', () => {
    return {
        getCodes: vi.fn(() => {
            return codes
        }),
        getTickets: vi.fn(() => {
            return tickets
        })
    }
})

describe('AdminView', async () => {
    router.push('/admin')
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const SuspenseWrapperComponent = defineComponent({
            components: { AdminView },
            template: `
            <Suspense>
                <AdminView />
            </Suspense> `
        })

        const suspenseWrapper = mount(SuspenseWrapperComponent, {
            global: {
                plugins: [router]
            }
        })

        await flushPromises()
        const wrapper = suspenseWrapper.findComponent({ name: 'AdminView' })

        expect(wrapper.text()).contains('Nytt ärende #')
        expect(wrapper.text()).contains('Försenad: 10 minuter')
        expect(wrapper.text()).contains('Orsakskod')
        expect(wrapper.text()).contains('Bakre tåg')
        expect(wrapper.text()).contains('Befintliga ärenden')
        expect(wrapper.text()).contains('6505d0b1a60773cde6d0704d - ANA004 - 34312 - 2023-09-16')

        suspenseWrapper.unmount()
    })
})
