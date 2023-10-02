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
    current: {
        type: Object,
        required: true
    }
})

const reasoncodes = props.codes
const current = props.current
const trainnumbers = props.trainnumbers

/**
 * Assigns the first the default-values
 * for new ticket
 */
let code = current.code
let trainnumber = current.trainnumber
let traindate = current.traindate

if (!(trainnumber in trainnumbers)) {
    trainnumbers.push(trainnumber)
}

// /**
//  * Function for sending messages to other components
//  */
// const emit = defineEmits(['form-submitted'])
const store = useAuthStore()
let innerText = 'Edit'

/**
 * Sends a post request to the backend API for inserting
 * the form data into the database
 */
async function submitForm(code, trainnumber, traindate) {
    const updatedTicket = {
        _id: current.ticketnumber,
        code: code,
        trainnumber: trainnumber,
        traindate: traindate
    }

    await store.updateTicket(updatedTicket)
    editing.value = false
    innerText = 'Edit'
    // emit('form-submitted')
}

const editing = ref(false)
const toggleEditing = function () {
    if (editing.value == false) {
        editing.value = true
        innerText = 'Stop Edit'
    } else {
        editing.value = false
        innerText = 'Edit'
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
            <input type="text" disabled :value="current._id" />
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
        <button v-on:click.self="store.deleteTicket(current._id), $emit('form-submitted')">
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
