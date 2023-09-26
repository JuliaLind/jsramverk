<script setup>
import TicketTable from '../components/TicketTable.vue'
import TicketForm from '../components/TicketForm.vue'
import { ref } from 'vue'

const tickettable = ref(null);
</script>

<template>
    <suspense>
        <div class="ticket-container">
            <TicketForm @form-submitted="tickettable.updateTickets()"/>
            <br />
            <TicketTable ref="tickettable"/>
        </div>
    </suspense>
</template>

<style>
.ticket-container {
    padding: 2rem;
}
</style>
