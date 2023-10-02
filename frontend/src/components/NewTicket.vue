<script setup>
import { useAuthStore } from '@/stores/auth'
// import { RouterLink } from 'vue-router'
// import { defineProps } from 'vue'

const props = defineProps({
    trainnumbers: {
        type: Array,
        required: true
    },
    codes: {
        type: Array,
        required: true
    }
})

const trainnumbers = props.trainnumbers;
const reasoncodes = props.codes;
/**
 * Assigns the initial values for the form
 * list as a default value for the new ticket
 */
let code = reasoncodes[0].Code
let trainnumber = trainnumbers[0]
let traindate = new Date().toJSON().slice(0, 10)

/**
 * Function for sending messages to other components
 */
const emit = defineEmits(['form-submitted'])
const store = useAuthStore()

/**
 * Sends a post request to the backend API for inserting
 * the form data into the database
 */
async function submitForm(code, trainnumber, traindate) {
    const newTicket = {
        code: code,
        trainnumber: trainnumber,
        traindate: traindate
    }
    console.log("newTicket", newTicket)
    await store.submitNewTicket(newTicket)
    /**
     * Sends signal to tickets-component to re-render
     */
    emit('form-submitted')
}
</script>

<template>
    <div class="ticket">
        <form v-on:submit.prevent="submitForm(code, trainnumber, traindate)">
            <select name="trainnumer" v-model="trainnumber">
                <option v-for="train in trainnumbers" :key="train" :value="train">
                    {{ train}}
                </option>
            </select>
            <select name="code" v-model="code">
                <option v-for="code in reasoncodes" :key="code.Code" :value="code.Code">
                    {{ code.Code }} - {{ code.Level3Description }}
                </option>
            </select>
            <input type="date" name="traindate" v-model="traindate"/>
            <input type="submit" value="Submit" />
        </form>
    </div>
</template>

<style scoped></style>
