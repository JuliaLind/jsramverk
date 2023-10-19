import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import LoginForm from '../LoginForm.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('LoginForm', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    it('renders properly and submit works as intended', async () => {
        const auth = useAuthStore()

        auth.login = vi.fn()
        const wrapper = mount(LoginForm)

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
    it('tests to toggle visibility of password button', async () => {
        const wrapper = mount(LoginForm)

        await flushPromises()
        let password = wrapper.find('input[name=password]')
        expect(password.html()).toContain('type="password"')
        expect(password.html()).not.toContain('type="text"')
        let btn = wrapper.find('.material-symbols-outlined')
        expect(btn.text()).toBe("visibility")
        await btn.trigger('click')
        expect(btn.text()).toBe("visibility_off")
        password = wrapper.find('input[name=password]')
        expect(password.html()).not.toContain('type="password"')
        expect(password.html()).toContain('type="text"')
        wrapper.unmount()
    })
})
