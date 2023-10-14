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
    <div class="col-md-3">
        <div class="card shadow-sm">
            <div class="card-header h5">Enskilt ärende</div>
            <div class="card-body">
                <form v-on:submit.prevent="submitForm(code), $emit('form-submitted')">
                    <div class="form-group mb-3">
                        <label class="mb-1">Ärendenummer</label>
                        <input type="text" name="id" class="form-control" disabled :value="id" />
                    </div>
                    <div class="form-group mb-3">
                        <label class="mb-1">Tågnummer</label>
                        <input type="text" name="trainnumber" disabled class="form-control" :value="ticket.trainnumber" />
                    </div>
                    <div class="form-group mb-3">
                        <label class="mb-1">Orsakskod</label>
                        <select name="code" v-model="code" class="form-control" required :disabled="!editing">
                            <option v-for="code in reasoncodes" :key="code.Code" :value="code.Code">
                                {{ code.Code }} - {{ code.Level3Description }} - {{ code.Level2Description }} -
                                {{ code.Level1Description }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label class="mb-1">Datum</label>
                        <input type="date" name="traindate" class="form-control" disabled :value="ticket.traindate" />
                    </div>
                    <div class="form-group mb-3">
                        <input v-if="editing" class="btn btn-success" type="submit" value="Spara ändringar" />
                    </div>
                </form>
                <div class="container-small crud-buttons">
                    <button class="btn btn-dark" v-on:click.self="toggleEditing()" :disabled="id in socket.data">
                        {{ innerText }}
                    </button>
                    <button class="btn btn-danger delete" v-on:click.self="store.deleteTicket(deletedTicket), $emit('form-submitted')">
                        Ta bort
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
input:disabled,
select:disabled {
    background: #f8f8f8;
}

.crud-buttons {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

</style>
