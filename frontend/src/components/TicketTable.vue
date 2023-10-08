<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NewTicket from '../components/NewTicket.vue'
import SingleTicket from '../components/SingleTicket.vue'

const store = useAuthStore()
const tickets = ref([])
const updateTickets = async () => {
    tickets.value = await store.getTickets()
}

onMounted(async () => {
    await updateTickets()
})

// Note for later: consider moving tickets constant to auth-pinia
// store too, it would then be available from parent component too
</script>

<template>
    <h2>Befintliga ärenden</h2>
    <div class="old-tickets" id="old-tickets">
        <div class="titles">
            <span class="title">Ärendenummer</span>
            <span class="title">Tågnummer</span>
            <span class="title">Orsakskod</span>
            <span class="title">Datum</span>
            <span class="title">Actions</span>
        </div>
        <NewTicket @form-submitted="updateTickets()" />
        <SingleTicket
            v-for="ticket in tickets"
            :key="ticket._id"
            :ticket="ticket"
            @form-submitted="updateTickets()"
        />
    </div>
</template>

<style>
.delayed {
    height: 100vh;
    width: 40vw;
    padding: 2rem;
    overflow: scroll;
    background-color: white;
}
</style>
