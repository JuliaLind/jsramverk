<script setup>
/**
 * Component representing a list of all previous tickets
 */
import apiModel from '../models/api.js'
// import { getTickets } from '../models/api.js'
const tickets = await apiModel.getTickets()
// const tickets = await getTickets();

// let newTicketId = 0;
// const lastId = result.data[1] ? result.data[1].id : 0;
// newTicketId = lastId + 1;
</script>

<template>
    <div class="old-tickets" id="old-tickets">
        <h2>Befintliga ärenden</h2>
        <div v-for="(ticket, index) in tickets" :key="index">
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
