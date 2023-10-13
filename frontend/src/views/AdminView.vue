<script setup>
import TicketTable from '../components/TicketTable.vue'
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const store = useAuthStore()
</script>

<template>
    <div class="main-nav">
        <Header></Header>
    </div>
    <div class="container">
        <!-- Note for later: this one does not need to be a router link
        component, it is possible to do a router.push to for example /login from auth store -->
        <RouterLink to="/" @click="store.logout()"> Logga ut </RouterLink>
        <br />
        <RouterLink to="/"> Tillbaka </RouterLink>
        <div class="ticket-container">
            <TicketTable />
        </div>
    </div>
    <div class="footer fixed-bottom">
        <Footer></Footer>
    </div>

</template>

<style>
.ticket-container {
    padding: 2rem;
}
</style>
