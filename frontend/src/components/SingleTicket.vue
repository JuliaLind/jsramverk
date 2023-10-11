<script setup>
import { useAuthStore } from '@/stores/auth'

import { getCodes } from '../services/api.service.js'
import { ref, onMounted } from 'vue'
import { socketStore } from '@/stores/socket'

const props = defineProps({
    ticket: {
        type: Object,
        required: true
    }
})

let reasoncodes = ref([])
const ticket = props.ticket

onMounted(async () => {
    reasoncodes.value = await getCodes()
})

/**
 * Assigns the first the default-values
 * for new ticket
 */
let code = ticket.code
const id = ticket._id
const store = useAuthStore()
const socket = socketStore()
let innerText = 'Ändra'

/**
 * Sends a post request to the backend API for inserting
 * the form data into the database
 */
async function submitForm(code) {
    const updatedTicket = `
    mutation {
        updateTicket(_id: "${id}", code: "${code}") {
            _id
            code
            trainnumber
        }
    }
    `

    await store.updateTicket(updatedTicket)
    socket.notifyBackendStopEdit({
        ticket: id
    })
    editing.value = false
    innerText = 'Ändra'
}

const editing = ref(false)
// const socketEdit = ref(false)

const sendToBackend = {
    ticket: ticket._id,
    user: store.userId
}

onMounted(() => {
    socket.listenForTicketLock()
    socket.listenForTicketUnlock()
})

const deletedTicket = `
    mutation {
        deleteTicket(_id: "${id}") {
            _id
        }
    }
`

const toggleEditing = function () {
    if (editing.value == false) {
        editing.value = true
        innerText = 'Återgå'
        socket.notifyBackendEdit(sendToBackend)
    } else {
        editing.value = false
        innerText = 'Ändra'
        code = ticket.code
        socket.notifyBackendStopEdit({
            ticket: id
        })
    }
}

</script>

<template>
    <div class="ticket">
        <form v-on:submit.prevent="submitForm(code), $emit('form-submitted')">
            <input type="text" class="field-1" disabled :value="id" />
            <input type="text" disabled class="field-2" :value="ticket.trainnumber" />
            <select name="code" v-model="code" class="field-3" required :disabled="!editing">
                <option v-for="code in reasoncodes" :key="code.Code" :value="code.Code">
                    {{ code.Code }} - {{ code.Level3Description }} - {{ code.Level2Description }} -
                    {{ code.Level1Description }}
                </option>
            </select>
            <input type="date" class="field-4" disabled :value="ticket.traindate" />
            <input v-if="editing" class="field-5" type="submit" value="Spara ändringar" />
        </form>
        <button v-on:click.self="toggleEditing()" :disabled="id in socket.data">{{ innerText }}</button>
        <button v-on:click.self="store.deleteTicket(deletedTicket), $emit('form-submitted')">
            Ta bort
        </button>
    </div>
</template>

<style scoped>
input,
select {
    border-radius: 0;
}

input:disabled,
select:disabled {
    border: 1px solid #333;
    background: #fff;
}

select {
    border: 1px solid #07470e;
}

input,
select {
    padding: 0.2em;
}

.ticket {
    display: flex;
    flex-direction: row;
}
</style>
