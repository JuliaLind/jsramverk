<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted } from 'vue'
import { getCodes } from '../services/api.service.js'

const props = defineProps({
    ticket: {
        type: Object,
        required: true
    }
})

let reasoncodes = ref([])
const ticket = props.ticket

onMounted(async () => {
    reasoncodes.value = await getCodes();
})


/**
 * Assigns the first the default-values
 * for new ticket
 */
let code = ticket.code
const id = ticket._id
const store = useAuthStore()
let innerText = 'Edit'

/**
 * Sends a post request to the backend API for inserting
 * the form data into the database
 */
async function submitForm(code) {
    const updatedTicket = {
        _id: id,
        code: code
    }

    await store.updateTicket(updatedTicket)
    editing.value = false
    innerText = 'Ändra'
}

const editing = ref(false)
const toggleEditing = function () {
    if (editing.value == false) {
        editing.value = true
        innerText = 'Återgå'
    } else {
        editing.value = false
        innerText = 'Ändra'
        code = ticket.code
    }
}
</script>

<template>
    <div class="ticket">
        <form v-on:submit.prevent="submitForm(code), $emit('form-submitted')">
            <input type="text" disabled :value="id" />
            <input type="text" disabled :value="ticket.trainnumber" />
            <select name="code" v-model="code" required :disabled="!editing">
                <option v-for="code in reasoncodes" :key="code.Code" :value="code.Code">
                    {{ code.Code }} - {{ code.Level3Description }} - {{ code.Level2Description }} -
                    {{ code.Level1Description }}
                </option>
            </select>
            <input type="date" disabled :value="ticket.traindate" />
            <input v-if="editing" type="submit" value="Spara ändringar" />
        </form>
        <button v-on:click.self="toggleEditing()">{{ innerText }}</button>
        <button v-on:click.self="store.deleteTicket(ticket._id), $emit('form-submitted')">
            Ta bort
        </button>
    </div>
</template>

<style scoped>
.ticket {
    display: flex;
    flex-direction: row;
}
</style>
