import { vi, describe, it, expect, afterEach } from 'vitest'
import LoginView from '../LoginView.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
// import { defineComponent } from 'vue'


const router = createRouter({
    history: createWebHistory(),
    routes: routes
})



describe('AdminView', async () => {
    router.push('/login')
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    // it('renders properly', async () => {
    //     vi.mock('@/stores/auth', () => ({
    //         useAuthStore: () => ({
    //             token: "",
    //             getToken: vi.fn(() => {
    //                 return ""
    //             }),
    //             register: vi.fn(() => {
    //                 return "imavalidtoken"
    //             }),
    //             login: vi.fn(() => {
    //                 return "imavalidtoken"
    //             }),
    //         })
    //     }))
    //     const SuspenseWrapperComponent = defineComponent({
    //         components: { LoginView },
    //         template: `
    //         <Suspense>
    //             <LoginView />
    //         </Suspense> `
    //     })

    //     await flushPromises()
    //     const suspenseWrapper = mount(SuspenseWrapperComponent, {
    //         global: {
    //             plugins: [router]
    //         }
    //     })

    //     await flushPromises()
    //     const wrapper = suspenseWrapper.findComponent({ name: 'LoginView' })
    //     expect(wrapper.text()).contains('Logga in')
    //     expect(wrapper.text()).contains('Register')


    //     suspenseWrapper.unmount()
    // })

    it('renders properly', async () => {
        vi.mock('@/stores/auth', () => ({
            useAuthStore: () => ({
                token: "",
                getToken: vi.fn(() => {
                    return ""
                }),
                register: vi.fn(() => {
                    return "imavalidtoken"
                }),
                login: vi.fn(() => {
                    return "imavalidtoken"
                }),
            })
        }))


        const wrapper = mount(LoginView, {
            global: {
                plugins: [router]
            }
        })
        await flushPromises()
        expect(wrapper.text()).contains('Logga in')
        expect(wrapper.text()).contains('Register')


        wrapper.unmount()
    })
})
