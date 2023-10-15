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
</script>

<template>
    <div class="wrapper-container">
        <NewTicket @form-submitted="updateTickets()" />
        <div class="container">
    <table class="old-tickets" id="old-tickets">
        <thead>
        <tr><th class="title" colspan="5">
            Befintliga ärenden
        </th></tr>
        <tr class="titles">
            <th>Ärendenummer</th>
            <th>Tågnr</th>
            <th>Orsakskod</th>
            <th>Datum</th>
            <th>Actions</th>
        </tr>
        </thead>
        <SingleTicket
            v-for="ticket in tickets"
            :key="ticket._id"
            :ticket="ticket"
            @form-submitted="updateTickets()"
        />
    </table>
        </div>
    </div>
</template>

<style scoped>

.old-tickets {
    width: clamp(400px, 100%, 1200px);
    table-layout: auto;
}

th.title {
    padding: 0.5em;
}

thead {
    position: sticky;
    top: 0;
}


.title,
.titles {
    background-color: #0d6efd;
    color: #fff;
    font-weight: 400;
    font-family: sans-serif;
    border-radius: 5px 5px 0 0;
    text-align: center;
}

.titles {
    border-top: 1px solid #ccc;
}

.titles th {
    padding: 0.5em;
    font-size: 1.25rem;
    font-weight: 400;
    font-family: sans-serif;
}
.container {
    width: 100%;
}

.wrapper-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    position: relative;
}


</style>
