<script setup>
/**
 * Component representing a list of all previous tickets
 */
import { getTickets } from '../services/api.service.js'
import { ref } from 'vue'

const tickets = ref([]);

const updateTickets = async () => {
    tickets.value = await getTickets();
}

updateTickets();

defineExpose({
  tickets,
  updateTickets
})

// let newTicketId = 0;
// const lastId = result.data[1] ? result.data[1].id : 0;
// newTicketId = lastId + 1;
</script>

<template>
    <div class="old-tickets" id="old-tickets">
        <h2>Befintliga ärenden</h2>
        <div v-for="ticket in tickets" :key="ticket._id">
            {{ ticket._id }} - {{ ticket.code }} - {{ ticket.trainnumber }} - {{ ticket.traindate }}
        </div>
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
