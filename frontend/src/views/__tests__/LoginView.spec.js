import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import LoginView from '../LoginView.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { setActivePinia, createPinia } from 'pinia'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

describe('LoginView', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        const wrapper = mount(LoginView, {
            global: {
                plugins: [router]
            }
        })
        await flushPromises()
        let btn = wrapper.find('button.toggle-link')
        expect(btn.text()).contains('Till registrering')
        await btn.trigger('click')
        btn = wrapper.find('button.toggle-link')
        expect(btn.text()).contains('Till inloggning')

        wrapper.unmount()
    })
})
