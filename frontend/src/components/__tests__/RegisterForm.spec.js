import { vi, describe, it, expect, afterEach, beforeEach  } from 'vitest'
import RegisterForm from '../RegisterForm.vue'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

describe('RegisterForm', async () => {
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

        auth.register = vi.fn()

        const wrapper = mount(RegisterForm, {
            global: {
                plugins: [router]
            }
        })

        expect(wrapper.text()).contains('Registrering')
        expect(wrapper.text()).contains('Namn')
        expect(wrapper.text()).contains('E-postadress')
        expect(wrapper.text()).contains('Lösenord')

        
        await wrapper.find('input[type=email]').setValue('my@mail.com')
        await wrapper.find('input[type=password]').setValue('pass')
        await wrapper.find('input[type=text]').setValue('My Name')
        await wrapper.find('form').trigger('submit')
        expect(auth.register).toHaveBeenCalledWith('my@mail.com', 'pass', "My Name")
        wrapper.unmount()
    })
})
