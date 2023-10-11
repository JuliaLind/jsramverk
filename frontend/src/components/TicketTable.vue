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

    // const result = await fetch(`${import.meta.env.VITE_URL}/graphql`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         'x-access-token': store.token
    //     },
    //     body: JSON.stringify({ query: query })
    // })
    // const data = await result.json()
    // console.log('data returned:', data)
})

// Note for later: consider moving tickets constant to auth-pinia
// store too, it would then be available from parent component too
</script>

<template>
    <h2>Befintliga ärenden</h2>
    <div class="old-tickets" id="old-tickets">
        <div class="titles">
            <div class="title field-1">Ärendenummer</div>
            <div class="title field-2">Tågnr</div>
            <div class="title field-3">Orsakskod</div>
            <div class="title field-4">Datum</div>
            <div class="title field-5">Actions</div>
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

<style scoped>
.delayed {
    height: 100vh;
    width: 40vw;
    padding: 2rem;
    overflow: scroll;
    background-color: white;
}

.titles,
form {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-wrap: nowrap;
}

.title {
    border: 1px solid #333;
    background: #fff;
    padding: 0.2em;
}

.old-tickets {
    width: max-content;
}

</style>
