import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import RegisterForm from '../RegisterForm.vue'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('RegisterForm', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly and submit works as intended', async () => {
        const auth = useAuthStore()

        auth.register = vi.fn()

        const wrapper = mount(RegisterForm)

        expect(wrapper.text()).contains('Registrering')
        expect(wrapper.text()).contains('Namn')
        expect(wrapper.text()).contains('E-postadress')
        expect(wrapper.text()).contains('Lösenord')

        // fill out the form and submit
        await wrapper.find('input[type=email]').setValue('my@mail.com')
        await wrapper.find('input[type=password]').setValue('pass')
        await wrapper.find('input[type=text]').setValue('My Name')
        await wrapper.find('form').trigger('submit')

        // make sure the register method was called with the filled out parameters
        expect(auth.register).toHaveBeenCalledWith('my@mail.com', 'pass', 'My Name')
        wrapper.unmount()
    })
    it('tests to toggle visibility of password by toggling the visibility button', async () => {
        const wrapper = mount(RegisterForm)

        // find the password field and make sure it has type password and not text
        let password = wrapper.find('input[name=password]')
        expect(password.html()).toContain('type="password"')
        expect(password.html()).not.toContain('type="text"')

        // find the toggle visibility icon and make sure it displays
        // correct google icon
        let btn = wrapper.find('.material-symbols-outlined')
        expect(btn.text()).toBe('visibility')

        // click on the button and make sure the icon changes correctly,
        await btn.trigger('click')
        expect(btn.text()).toBe('visibility_off')

        // find the password field again and make sure the type
        // has changed from password to text
        password = wrapper.find('input[name=password]')
        expect(password.html()).not.toContain('type="password"')
        expect(password.html()).toContain('type="text"')

        // click the toggle button again
        // and make sure all values have been restored to initial
        await btn.trigger('click')
        expect(btn.text()).toBe('visibility')
        password = wrapper.find('input[name=password]')
        expect(password.html()).toContain('type="password"')
        expect(password.html()).not.toContain('type="text"')
        wrapper.unmount()
    })
})
