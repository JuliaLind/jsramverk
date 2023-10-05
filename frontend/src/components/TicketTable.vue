<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NewTicket from '../components/NewTicket.vue'
import SingleTicket from '../components/SingleTicket.vue'
import { getCodes, getTrainNumbers } from '../services/api.service.js'

const store = useAuthStore()
let reasoncodes
const show = ref(false)
let innerText = ref('Add new')
const toggleNewForm = () => {
    if (show.value == false) {
        show.value = true
        innerText.value = 'Hide'
    } else {
        show.value = false
        innerText.value = 'Add new'
    }
}
const tickets = ref([])
const updateTickets = async () => {
    tickets.value = await store.getTickets()
}
let trainnumbers

onMounted(async () => {
    reasoncodes = await getCodes()
    trainnumbers = await getTrainNumbers()
    updateTickets()
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
            <button @click="toggleNewForm()">{{ innerText }}</button>
        </div>
        <NewTicket
            v-if="show"
            :codes="reasoncodes"
            :trainnumbers="trainnumbers"
            @form-submitted="updateTickets(), toggleNewForm()"
            ref="show"
        />
        <SingleTicket
            v-for="ticket in tickets"
            :key="ticket._id"
            :codes="reasoncodes"
            :trainnumbers="trainnumbers"
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
