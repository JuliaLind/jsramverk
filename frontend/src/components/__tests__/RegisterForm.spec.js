import { vi, describe, it, expect, afterEach } from 'vitest'
import RegisterForm from '../RegisterForm.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { defineComponent } from 'vue'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})


describe('RegisterForm', async () => {
    router.push('/login')
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

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
        const SuspenseWrapperComponent = defineComponent({
            components: { RegisterForm },
            template: `
            <Suspense>
                <RegisterForm />
            </Suspense> `
        })

        const suspenseWrapper = mount(SuspenseWrapperComponent,
            {
                global: {
                    plugins: [router]
                }
            }
        )


        await flushPromises()
        const wrapper = suspenseWrapper.findComponent({ name: 'RegisterForm' })


        expect(wrapper.text()).contains('Registreringsformulär')
        expect(wrapper.text()).contains('Namn')
        expect(wrapper.text()).contains('E-postaddress')
        expect(wrapper.text()).contains('Lösenord')
        suspenseWrapper.unmount()
    })
})
