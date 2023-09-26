<script setup>
import TicketTable from '../components/TicketTable.vue'
import TicketForm from '../components/TicketForm.vue'
import { ref } from 'vue'

/**
 * key of the TicketTable component
 * is increased each time the ticket
 * form is submitted, which leads
 * to re-rendering of the tickets list
 */
const componentKey = ref(0)
const forceRerender = () => {
    componentKey.value += 1
}
</script>

<template>
    <suspense>
        <div class="ticket-container">
            <TicketForm @form-submitted="forceRerender" />
            <br />
            <TicketTable :key="componentKey" />
        </div>
    </suspense>
</template>

<style>
.ticket-container {
    padding: 2rem;
}
</style>
