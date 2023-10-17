import { vi, describe, it, expect, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'


function createFetchResponse(data) {
    return { json: () => new Promise((resolve) => resolve(data)) }
}

describe('auth-store', async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
      })
    afterEach(() => {
        vi.restoreAllMocks()
    })


    it('tests login', async () => {
        global.fetch = vi.fn()
        fetch.mockResolvedValue(createFetchResponse({
            data: {
                token: "thisisavalidtoken",
                user: {
                    email: "myemail@email.com",
                    name: "My Name"
                }
            }
        }))
        const store = useAuthStore()
        await store.login("myemail@email.com", "mypassword");

        expect(fetch).toHaveBeenCalledWith(
            'https://jsramverk-marjul2023.azurewebsites.net/login',
            {
              method: 'POST',
              body: JSON.stringify({
                email: "myemail@email.com",
                password: "mypassword"
              }),
              headers: {
                // Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            },
          )
    })
    it('tests logout', async () => {
        const store = useAuthStore()
        store.token = "iamatoken"
        expect(store.token).toBe("iamatoken"
        )
        store.logout();
        expect(store.token).toBe(""
        )
    })
})