<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const props = defineProps({
    trainnumbers: {
        type: Array,
        required: true
    },
    codes: {
        type: Array,
        required: true
    },
    ticket: {
        type: Object,
        required: true
    }
})

const reasoncodes = props.codes
const ticket = props.ticket
const trainnumbers = props.trainnumbers

/**
 * Assigns the first the default-values
 * for new ticket
 */
let code = ticket.code
let trainnumber = ticket.trainnumber
let traindate = ticket.traindate
const id = ticket._id

if (!(trainnumber in trainnumbers)) {
    trainnumbers.push(trainnumber)
}

/**
 * Function for sending messages to other components
 */
const emit = defineEmits(['form-submitted'])
const store = useAuthStore()
let innerText = 'Edit'

/**
 * Sends a post request to the backend API for inserting
 * the form data into the database
 */
async function submitForm(code, trainnumber, traindate) {
    const updatedTicket = {
        _id: id,
        code: code,
        trainnumber: trainnumber,
        traindate: traindate
    }

    await store.updateTicket(updatedTicket)
    editing.value = false
    innerText = 'Edit'
}

const editing = ref(false)
const toggleEditing = function () {
    if (editing.value == false) {
        editing.value = true
        innerText = 'Stop Edit'
    } else {
        editing.value = false
        innerText = 'Edit'
        code = ticket.code
        trainnumber = ticket.trainnumber
        traindate = ticket.traindate
    }
}
</script>

<template>
    <div class="ticket">
        <form
            v-on:submit.prevent="
                submitForm(code, trainnumber, traindate),
                $emit('form-submitted')
            "
        >
            <input type="text" disabled :value="id" />
            <select
                name="trainnumber"
                v-model="trainnumber"
                required="required"
                :disabled="!editing"
            >
                <option v-for="train in trainnumbers" :key="train" :value="train">
                    {{ train }}
                </option>
            </select>
            <select name="code" v-model="code" required="required" :disabled="!editing">
                <option v-for="code in reasoncodes" :key="code.Code" :value="code.Code">
                    {{ code.Code }} - {{ code.Level3Description }}
                </option>
            </select>
            <input
                type="date"
                name="traindate"
                required="required"
                v-model="traindate"
                :disabled="!editing"
            />
            <input v-if="editing" type="submit" value="Save" />
        </form>
        <button v-on:click.self="toggleEditing()">{{ innerText }}</button>
        <button v-on:click.self="store.deleteTicket(ticket._id), $emit('form-submitted')">
            Delete
        </button>
    </div>
</template>

<style scoped>
.ticket {
    display: flex;
    flex-direction: row;
}
</style>
