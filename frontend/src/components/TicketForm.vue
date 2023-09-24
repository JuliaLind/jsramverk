<script setup>
import { useTicketStore } from '@/stores/ticket'
// import apiModel from '../models/api.js'
import { getCodes, submitNewTicket } from '../models/api.service.js'
import { createLocationString } from '../models/utils.js'
import { RouterLink } from 'vue-router'
import { defineEmits } from 'vue'

/**
 * Function for sending messages to other components
 */
const emit = defineEmits(['form-submitted'])
const store = useTicketStore()

/**
 * @var {Object} item - Object containing data for a delayed train
 * @example {
 * ActivityId: "62e8c1b6-18d1-5d01-505d-c63c117da404",
 * ActivityType: "Avgang",
 * AdvertisedTimeAtLocation: "2023-09-15T23:47:00.000+02:00",
 * AdvertisedTrainIdent: "44253",
 * Canceled: false,
 * EstimatedTimeAtLocation: "2023-09-16T00:59:36.000+02:00",
 * LocationSignature: "Era",
 * OperationalTrainNumber: "44253",
 * delayTime: "72 minuter" }
 */
const item = store.getCurrent()
const locationString = createLocationString(item)
// const reasonCodes = await apiModel.getCodes()
const reasonCodes = await getCodes()

/**
 * Assigns the first reasoncode in the drop-down
 * list as a default value for the new ticket
 */
item.reasonCode = reasonCodes[0].Code

/**
 * Updates the reasoncode when the user selects
 * a reasoncode from the drop-down list
 */
function onChange(event) {
    item.reasonCode = event.target.value
}

/**
 * Sends a post request to the backend API for inserting
 * the form data into the database
 */
async function submitForm() {
    const newTicket = {
        code: item.reasonCode,
        trainnumber: item.OperationalTrainNumber,
        traindate: item.EstimatedTimeAtLocation.substring(0, 10)
    }
    // await apiModel.submitNewTicket(newTicket)
    await submitNewTicket(newTicket)
    /**
     * Sends signal to tickets-component to re-render
     */
    emit('form-submitted')
}
</script>

<template>
    <div class="ticket">
        <RouterLink to="/">Tillbaka</RouterLink>
        <h1>Nytt ärende #<span id="new-ticket-id"></span></h1>
        <h3>{{ locationString }}</h3>
        <p><strong>Försenad:</strong> {{ item.delayTime }}</p>
        <form id="new-ticket-form" v-on:submit.prevent="submitForm">
            <label>Orsakskod</label><br />
            <select id="reason-code" name="code" @change="onChange">
                <option v-for="(code, index) in reasonCodes" :key="index" :value="code.Code">
                    {{ code.Code }} - {{ code.Level3Description }}
                </option></select
            ><br /><br />
            <input type="submit" value="Skapa nytt ärende" />
        </form>
    </div>
</template>

<style scoped></style>
