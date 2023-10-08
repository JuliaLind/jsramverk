<script setup>
import TicketTable from '../components/TicketTable.vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTrainsStore } from '@/stores/trains'
const store = useAuthStore()
const trainsStore = useTrainsStore()
</script>



<template>
    <!-- Note for later: this one does not need to be a router link
    component, it is possible to do a router.push to for example /login from auth store -->
    <RouterLink to="/" @click="store.logout()"> Logga ut </RouterLink>
    <br />
    <RouterLink to="/"> Tillbaka </RouterLink>
    <div class="ticket-container">
        <TicketTable />
    </div>
</template>

<style>
.ticket-container {
    padding: 2rem;
}
</style>
