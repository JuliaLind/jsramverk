<script setup>
import TicketTable from '../components/TicketTable.vue'
// import NewTicket from '../components/NewTicket.vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const store = useAuthStore()


// const reasonCodes = await getCodes()
// const data = await getDelayedTrains()
// const trainNumbers = data.map(item => item.OperationalTrainNumber)


// const tickettable = ref(null)

</script>

<template>
    <!-- Note for later: this one does not need to be a router link
    component, it is possible to do a router.push to for example /login from auth store -->
    <RouterLink to="/" @click="store.logout()">
        Logga ut
    </RouterLink>
    <br />
    <RouterLink to="/">
        Tillbaka
    </RouterLink>
    <suspense>

        <div class="ticket-container">
            <!-- <NewTicket @form-submitted="tickettable.updateTickets()"/>
            <br /> -->
            <!-- <TicketTable ref="tickettable"/> -->
            <TicketTable />
        </div>
    </suspense>
</template>

<style>
.ticket-container {
    padding: 2rem;
}
</style>
