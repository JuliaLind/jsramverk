<script setup>
import TicketTable from '../components/TicketTable.vue'
import { onMounted, ref } from 'vue'
import HeaderComp from '../components/HeaderComp.vue';
import FooterComp from '../components/FooterComp.vue';
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import socket from '../services/socket.service.js'
const store = useAuthStore()


const counter = ref(0)


onMounted(() => {
    socket.on("refresh-tickets", () => {
    counter.value += 1
})
socket.on("updated", () => {
    counter.value += 1
})
})



</script>

<template>
    <div class="main-nav">
        <HeaderComp></HeaderComp>
    </div>
    <div class="logout">
        <RouterLink class="btn btn-warning" to="/" @click="store.logout()"> Logga ut </RouterLink>
    </div>
    <div class="container">
        <!-- Note for later: this one does not need to be a router link
        component, it is possible to do a router.push to for example /login from auth store -->
        <div class="ticket-container">
            <TicketTable :key="counter" />
        </div>
    </div>
    <div class="footer fixed-bottom">
        <FooterComp></FooterComp>
    </div>

</template>

<style>
.logout {
    text-align: end;
    margin: 1.5em 1.5em;
}

.ticket-container {
    padding: 0;
}

.container {
    padding-bottom: 5rem;
}

</style>
