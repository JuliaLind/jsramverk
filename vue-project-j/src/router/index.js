import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import TicketView from '../views/TicketView.vue'

const routes = [
    {
        path: '/',
        name: 'main',
        component: MainView
    },
    {
        path: '/tickets',
        name: 'tickets',
        component: TicketView,
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export { routes };
export default router
