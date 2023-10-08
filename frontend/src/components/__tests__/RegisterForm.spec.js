import { vi, describe, it, expect, afterEach } from 'vitest'
import RegisterForm from '../RegisterForm.vue'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

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

        const wrapper = mount(RegisterForm, {
            global: {
                plugins: [router]
            }
        })

        expect(wrapper.text()).contains('Registreringsformulär')
        expect(wrapper.text()).contains('Namn')
        expect(wrapper.text()).contains('E-postaddress')
        expect(wrapper.text()).contains('Lösenord')
        wrapper.unmount()
    })
})
