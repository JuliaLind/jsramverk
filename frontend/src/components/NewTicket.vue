<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { getCodes, getTrainNumbers } from '../services/api.service.js'

let trainnumbers = ref([])
let reasoncodes = ref([])
let code
let trainnumber

onMounted(async () => {
    reasoncodes.value = await getCodes()
    trainnumbers.value = await getTrainNumbers()
})

/**
 * Assigns the initial values for the form
 * list as a default value for the new ticket
 */

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
    const newTicket = `
        mutation {
            createTicket(code: "${code}", trainnumber: "${trainnumber}", traindate: "${traindate}") {
                _id
                code
            }
        }
    `
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
            <input type="text" class="field-1" disabled value="Lägg till nytt ärende" />
            <select name="trainnumer" class="field-2" required v-model="trainnumber">
                <option v-for="train in trainnumbers" :key="train" :value="train">
                    {{ train }}
                </option>
            </select>
            <select name="code" required class="field-3" v-model="code">
                <option v-for="code in reasoncodes" :key="code.Code" :value="code.Code">
                    {{ code.Code }} - {{ code.Level3Description }} - {{ code.Level2Description }} -
                    {{ code.Level1Description }}
                </option>
            </select>
            <input type="date" disabled name="traindate" v-model="traindate" />
            <input type="submit" class="btn" value="Skapa" />
        </form>
    </div>
</template>

<style scoped>
input:disabled,
select:disabled {
    border: 1px solid #333;
    background: #ffffff;
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
