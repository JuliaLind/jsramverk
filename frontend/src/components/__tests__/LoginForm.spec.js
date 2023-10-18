import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import LoginForm from '../LoginForm.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

describe('LoginForm', async () => {
    router.push('/login')
    await router.isReady()

    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    it('renders properly and submit works as intended', async () => {
        const auth = useAuthStore()

        auth.login = vi.fn()
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [router]
            }
        })

        await flushPromises()
        expect(wrapper.text()).contains('Logga in')
        expect(wrapper.text()).contains('E-postadress')
        expect(wrapper.text()).contains('Lösenord')

        await wrapper.find('input[type=email]').setValue('my@mail.com')
        await wrapper.find('input[type=password]').setValue('pass')
        await wrapper.find('form').trigger('submit')
        expect(auth.login).toHaveBeenCalledWith('my@mail.com', 'pass')

        wrapper.unmount()
    })
})
