import { vi, describe, it, expect, afterEach } from 'vitest'
import LoginForm from '../LoginForm.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

describe('LoginForm', async () => {
    router.push('/login')
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        vi.mock('@/stores/auth', () => ({
            useAuthStore: () => ({
                token: '',
                getToken: vi.fn(() => {
                    return ''
                }),
                register: vi.fn(() => {
                    return 'imavalidtoken'
                }),
                login: vi.fn(() => {
                    return 'imavalidtoken'
                })
            })
        }))

        const wrapper = mount(LoginForm, {
            global: {
                plugins: [router]
            }
        })

        await flushPromises()
        expect(wrapper.text()).contains('Logga in')
        expect(wrapper.text()).contains('E-postaddress')
        expect(wrapper.text()).contains('Lösenord')
        wrapper.unmount()

        // note to self: add test for clicking on the submitbutton and checking that submitNewTickets function is salled. Also add test for checking codes in options dropdown
    })
})
