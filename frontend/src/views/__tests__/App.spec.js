import { mount, flushPromises } from '@vue/test-utils'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import App from '../../App.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

let router

describe('Router', async () => {
    beforeEach(async () => {
        router = createRouter({
            history: createWebHistory(),
            routes: routes
        })
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    it('tests to go from main view to admin', async () => {
        const store = useAuthStore()
        store.logout = vi.fn()
        router.push('/')
        await router.isReady()

        const wrapper = mount(App, {
            global: {
                plugins: [router]
            }
        })
        expect(wrapper.html()).toContain('Försenade tåg')
        await wrapper.find('a[href="/admin"]').trigger('click')
        await flushPromises()
        expect(wrapper.html()).toContain('Befintliga ärenden')
        await wrapper.find('.btn-warning').trigger('click')
        expect(store.logout).toHaveBeenCalledOnce()
    })
})
