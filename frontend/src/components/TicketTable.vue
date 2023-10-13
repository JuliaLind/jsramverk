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
        <div class="container">
            <div class="h1">
                <h2>Befintliga ärenden</h2>
            </div>
            <div class="old-tickets mt-3" id="old-tickets">
                <NewTicket @form-submitted="updateTickets()" />
                <SingleTicket
                    v-for="ticket in tickets"
                    :key="ticket._id"
                    :ticket="ticket"
                    @form-submitted="updateTickets()"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>

.old-tickets {
    gap: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

</style>
