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

        await wrapper.find('input[type=email]').setValue('my@mail.com')
        await wrapper.find('input[type=password]').setValue('pass')
        await wrapper.find('input[type=text]').setValue('My Name')
        await wrapper.find('form').trigger('submit')
        expect(auth.register).toHaveBeenCalledWith('my@mail.com', 'pass', 'My Name')
        wrapper.unmount()
    })
    it('tests to toggle visibility of password by toggling the visibility button', async () => {
        const wrapper = mount(RegisterForm)

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
