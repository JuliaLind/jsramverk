<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted } from 'vue'
import { socketStore } from '@/stores/socket'
import socketService from '../services/socket.service.js'

const props = defineProps({
    ticket: {
        type: Object,
        required: true
    }
})
const store = useAuthStore()

let reasoncodes = ref([])
const ticket = props.ticket

onMounted(async () => {
    reasoncodes.value = store.reasonCodes
})

/**
 * Assigns the first the default-values
 * for new ticket
 */
let code = ref(ticket.code)
const id = ticket._id

const socket = socketStore()
let innerText = 'Ändra'

/**
 * Sends a post request to the backend API for inserting
 * the form data into the database
 */
async function submitForm(code) {
    const updatedTicket = `
    mutation {
        updateTicket(_id: "${ticket._id}", code: "${code}") {
            _id
            code
            trainnumber
        }
    }
    `
    await store.updateTicket(updatedTicket)
    editing.value = false
    innerText = 'Ändra'
}

const editing = ref(false)
const sendToBackend = {
    ticket: ticket._id,
    user: store.userEmail
}

onMounted(() => {
    socket.listenForTicketLock()
    socket.listenForTicketUnlock()
})

socketService.on('refresh-ticket', (data) => {
    if (data._id === id) {
        code.value = data.code
    }
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
        console.log(sendToBackend)
    } else {
        editing.value = false
        innerText = 'Ändra'
        code.value = ticket.code
        socket.notifyBackendStopEdit({
            ticket: id
        })
    }
}
</script>

<template>
    <tr class="ticket">
        <td>
            {{ id }}
        </td>
        <td>
            {{ ticket.trainnumber }}
        </td>
        <td>
            <select
                name="code"
                :class="{ unset: !editing }"
                v-model="code"
                required
                :disabled="!editing"
            >
                <option v-for="code in reasoncodes" :key="code.Code" :value="code.Code">
                    {{ code.Code }} - {{ code.Level3Description }}
                </option>
            </select>
        </td>
        <td>
            {{ ticket.traindate }}
        </td>
        <td>
            <input
                v-if="editing"
                class="btn btn-success"
                type="submit"
                value="Spara"
                @click="submitForm(code)"
            />
            <button
                class="btn btn-dark"
                v-on:click.self="toggleEditing()"
                :disabled="id in socket.data"
            >
                {{ innerText }}
            </button>
            <button
                class="btn btn-danger delete"
                v-on:click.self="store.deleteTicket(deletedTicket)"
                :disabled="id in socket.data"
            >
                Ta bort
            </button>
        </td>
    </tr>
</template>

<style scoped>
select {
    padding: 0.5em;
}
.unset {
    all: unset;
}

tr {
    border-top: 1px solid #ccc;
}

tr:nth-of-type(2n) {
    background-color: #f6f6f6;
}

td {
    padding: 0.5em;
}

select,
select.unset {
    max-width: 200px;
}

.crud-buttons {
    display: flex;
    flex-direction: row;
    gap: 20px;
}
</style>
