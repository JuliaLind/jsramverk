import { vi, describe, it, expect, afterEach } from 'vitest'
import LoginView from '../LoginView.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

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
