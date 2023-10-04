import { vi, describe, it, expect, afterEach } from 'vitest'
import NewTicket from '../NewTicket.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { defineComponent } from 'vue'
import { codes } from './mockdata/codes-small.js'
import { trainnumbers } from './mockdata/trainnumbers.js'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
vi.mock('@/stores/auth', () => ({
    useAuthStore: () => ({
        token: "imavalidtoken",
        getToken: () => {
            return this.token
        },
    })
}))


describe('NewTicket', async () => {
    router.push('/admin')
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const SuspenseWrapperComponent = defineComponent({
            components: { NewTicket },
            template: `
            <Suspense>
                <NewTicket :codes="codes" :trainnumbers="trainnumbers"/>
            </Suspense> `,
            props: {
                codes: Array,
                trainnumbers: Array
            }
        })

        const suspenseWrapper = mount(SuspenseWrapperComponent,
            {
                props: {
                    codes: codes,
                    trainnumbers: trainnumbers
                },
                global: {
                    plugins: [router]
                }
            }
        )


        await flushPromises()
        const wrapper = suspenseWrapper.findComponent({ name: 'NewTicket' })


        expect(wrapper.text()).contains('ANA002')
        expect(wrapper.text()).contains('8150')
        console.log(wrapper.text())
        suspenseWrapper.unmount()

        // note to self: add test for clicking on the submitbutton and checking that submitNewTickets function is salled. Also add test for checking codes in options dropdown
    })
})
