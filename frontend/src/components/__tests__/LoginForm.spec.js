import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import LoginForm from '../LoginForm.vue'
import { mount } from '@vue/test-utils'
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

        expect(wrapper.text()).contains('Logga in')
        expect(wrapper.text()).contains('E-postadress')
        expect(wrapper.text()).contains('Lösenord')

        // fill out the login form
        await wrapper.find('input[type=email]').setValue('my@mail.com')
        await wrapper.find('input[type=password]').setValue('pass')
        await wrapper.find('form').trigger('submit')

        // doublecheck that the login function was called with the filled out parameters
        expect(auth.login).toHaveBeenCalledWith('my@mail.com', 'pass')

        wrapper.unmount()
    })
    it('tests to toggle visibility of password by toggling the visibility button', async () => {
        const wrapper = mount(LoginForm)

        // find the password field and make sure it has type passwprd
        let password = wrapper.find('input[name=password]')
        expect(password.html()).toContain('type="password"')
        expect(password.html()).not.toContain('type="text"')

        // find the toggle visibility passwprd and make sure
        // it contains the correct icon (google-icon name)
        let btn = wrapper.find('.material-symbols-outlined')
        expect(btn.text()).toBe('visibility')

        // click on the toggle visibility icon and make sure it changed icon
        await btn.trigger('click')
        expect(btn.text()).toBe('visibility_off')

        // find the password field again and make sure the type is now longer
        // passwrod, but changed to text
        password = wrapper.find('input[name=password]')
        expect(password.html()).not.toContain('type="password"')
        expect(password.html()).toContain('type="text"')

        // click the toggle visibility button again and make sure the
        // initial values have been restored
        await btn.trigger('click')
        expect(btn.text()).toBe('visibility')
        password = wrapper.find('input[name=password]')
        expect(password.html()).toContain('type="password"')
        expect(password.html()).not.toContain('type="text"')

        wrapper.unmount()
    })
})
