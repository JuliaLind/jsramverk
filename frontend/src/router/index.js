import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'

import { useAuthStore } from '@/stores/auth'

export const routes = [
    {
        path: '/',
        name: 'main',
        component: MainView
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    }
]

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/', '/register']
    const authRequired = !publicPages.includes(to.path)
    const auth = useAuthStore()

    if (authRequired && !auth.getToken()) {
        auth.returnUrl = to.fullPath
        return '/login'
    }
})

// export { routes }
// export default router
